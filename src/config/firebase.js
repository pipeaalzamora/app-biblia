import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase.
// Los valores se leen de variables EXPO_PUBLIC_* (definidas en .env) para no
// hardcodear credenciales. En Android nativo, google-services.json complementa
// esta configuración para los SDK nativos.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId
);

let app = null;
let auth = null;

// Solo inicializa Firebase si hay configuración válida. En modo invitado
// (sin credenciales) la app funciona sin autenticación.
if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // initializeAuth con persistencia AsyncStorage (build RN de Firebase).
  // Si ya fue inicializado o la persistencia RN no está disponible, se reusa
  // getAuth para no romper la app.
  try {
    if (typeof getReactNativePersistence === 'function') {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      auth = getAuth(app);
    }
  } catch (error) {
    auth = getAuth(app);
  }
}

export { app, auth };
