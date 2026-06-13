import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// Carga perezosa del módulo nativo de Google Sign-In. Importarlo en el nivel
// superior usa TurboModuleRegistry.getEnforcing, que LANZA si el módulo nativo
// no existe (p. ej. en Expo Go). Lo cargamos solo al momento de usarlo, dentro
// de un try/catch, para no romper la app en entornos sin el binario nativo.
let GoogleSignin = null;
let statusCodes = {};

const cargarGoogleModule = () => {
  if (GoogleSignin) return true;
  try {
    const mod = require('@react-native-google-signin/google-signin');
    GoogleSignin = mod.GoogleSignin;
    statusCodes = mod.statusCodes || {};
    return true;
  } catch (error) {
    return false;
  }
};

let configurado = false;

// Configura Google Sign-In una sola vez (idempotente).
export const configurarGoogle = () => {
  if (configurado || !WEB_CLIENT_ID) return;
  if (!cargarGoogleModule()) return;
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configurado = true;
};

const traducirError = (error) => {
  const code = error?.code;
  if (code === statusCodes.SIGN_IN_CANCELLED) {
    return 'Inicio de sesión cancelado.';
  }
  if (code === statusCodes.IN_PROGRESS) {
    return 'Ya hay un inicio de sesión en curso.';
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services no está disponible o desactualizado.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Error de red. Revisa tu conexión.';
  }
  return 'No se pudo iniciar sesión con Google. Intenta de nuevo.';
};

export const iniciarSesionGoogle = async () => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase no está configurado.' };
  }
  if (!WEB_CLIENT_ID) {
    return { success: false, error: 'Falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.' };
  }
  if (!cargarGoogleModule()) {
    return {
      success: false,
      error: 'Google Sign-In requiere un development build (no Expo Go).',
    };
  }

  try {
    configurarGoogle();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();
    // Compatibilidad con distintas versiones del SDK (data.idToken o idToken).
    const idToken = response?.data?.idToken || response?.idToken;

    if (!idToken) {
      return { success: false, error: 'Google no devolvió un token válido.' };
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: traducirError(error) };
  }
};

export const cerrarSesion = async () => {
  try {
    if (cargarGoogleModule()) {
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignora si Google Sign-In no estaba inicializado.
      }
    }
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'No se pudo cerrar sesión.' };
  }
};

export const observarAuth = (callback) => {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
