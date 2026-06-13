import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

// Verificar si las notificaciones están disponibles
let notificationsAvailable = false;

try {
  if (Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    notificationsAvailable = true;
  }
} catch (error) {
  console.log('Notificaciones no disponibles en Expo Go');
  notificationsAvailable = false;
}

export const areNotificationsAvailable = () => notificationsAvailable;

export const requestNotificationPermissions = async () => {
  if (!notificationsAvailable) {
    console.log('Notificaciones no disponibles - requiere development build');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-verse', {
        name: 'Versículo Diario',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A90E2',
      });
    }

    return true;
  } catch (error) {
    console.error('Error solicitando permisos de notificación:', error);
    return false;
  }
};

export const scheduleDailyVerse = async (hour = 8, minute = 0) => {
  if (!notificationsAvailable) {
    return false;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Tu Versículo del Día',
        body: 'Toca para recibir tu palabra de aliento',
        data: { type: 'daily-verse' },
        sound: true,
      },
      trigger:
        Platform.OS === 'android'
          ? { ...trigger, channelId: 'daily-verse' }
          : trigger,
    });

    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify({
      enabled: true,
      hour,
      minute,
    }));

    return true;
  } catch (error) {
    console.error('Error programando notificación diaria:', error);
    return false;
  }
};

export const cancelDailyVerse = async () => {
  if (!notificationsAvailable) {
    return true;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify({
      enabled: false,
    }));
    return true;
  } catch (error) {
    console.error('Error cancelando notificaciones:', error);
    return false;
  }
};

export const getNotificationSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { enabled: false, hour: 8, minute: 0 };
  } catch (error) {
    return { enabled: false, hour: 8, minute: 0 };
  }
};

export const sendLocalNotification = async (title, body, data = {}) => {
  if (!notificationsAvailable) {
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error enviando notificación local:', error);
  }
};
