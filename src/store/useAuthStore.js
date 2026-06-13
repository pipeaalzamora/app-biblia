import { create } from 'zustand';
import Constants from 'expo-constants';
import { isFirebaseConfigured } from '../config/firebase';
import {
  observarAuth,
  iniciarSesionGoogle,
  cerrarSesion,
  configurarGoogle,
} from '../services/authService';

// Google Sign-In es un módulo nativo: no funciona en Expo Go. En ese entorno
// permitimos modo invitado para poder probar el resto de la app.
const enExpoGo = Constants.appOwnership === 'expo';

export const useAuthStore = create((set) => ({
  user: null,
  initializing: true,
  firebaseConfigured: isFirebaseConfigured,
  // Solo se exige login si Firebase está configurado y NO estamos en Expo Go.
  authRequired: isFirebaseConfigured && !enExpoGo,
  isExpoGo: enExpoGo,

  // Suscribe a cambios de sesión. Devuelve la función de limpieza.
  init: () => {
    if (!isFirebaseConfigured || enExpoGo) {
      set({ initializing: false, user: null });
      return () => {};
    }

    configurarGoogle();

    const unsubscribe = observarAuth((user) => {
      set({ user, initializing: false });
    });

    return unsubscribe;
  },

  loginWithGoogle: async () => {
    const result = await iniciarSesionGoogle();
    if (result.success) set({ user: result.user });
    return result;
  },

  logout: async () => {
    const result = await cerrarSesion();
    if (result.success) set({ user: null });
    return result;
  },
}));
