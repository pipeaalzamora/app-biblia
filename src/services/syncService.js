import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, isFirebaseConfigured } from '../config/firebase';

const DEVICE_ID_KEY = '@biblia_help_device_id';

const generateDeviceId = () => {
  const randomPart = Math.random().toString(36).slice(2, 12);
  return `device-${Date.now().toString(36)}-${randomPart}`;
};

export const getDeviceId = async () => {
  const existingDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const newDeviceId = generateDeviceId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
  return newDeviceId;
};

// Identidad de sincronización: prioriza el UID de Firebase (cuenta real) y
// cae al device ID cuando no hay sesión iniciada.
const getSyncId = async () => {
  if (isFirebaseConfigured && auth.currentUser) {
    return `uid-${auth.currentUser.uid}`;
  }
  return getDeviceId();
};

// El backend es opcional: sin URL configurada, sync se omite silenciosamente.
const backendDisponible = () => Boolean(CONFIGURACION.URL_BACKEND);

/**
 * Sincroniza favoritos con el servidor
 */
export const syncFavorites = async (favorites, searchHistory, preferences) => {
  if (!backendDisponible()) {
    return { success: false, error: 'Backend no configurado' };
  }

  try {
    const deviceId = await getSyncId();

    const response = await axios.post(
      `${CONFIGURACION.URL_BACKEND}/api/sync-favorites`,
      {
        deviceId,
        favorites,
        searchHistory,
        preferences,
      },
      {
        timeout: CONFIGURACION.TIMEOUT_API,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Obtiene datos sincronizados del servidor
 */
export const fetchSyncedData = async () => {
  if (!backendDisponible()) {
    return { success: false, error: 'Backend no configurado' };
  }

  try {
    const deviceId = await getSyncId();

    const response = await axios.get(
      `${CONFIGURACION.URL_BACKEND}/api/sync-favorites?deviceId=${encodeURIComponent(deviceId)}`,
      {
        timeout: CONFIGURACION.TIMEOUT_API,
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
