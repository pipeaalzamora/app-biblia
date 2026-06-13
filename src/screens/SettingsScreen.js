import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { TEMAS } from '../config/constantes';
import {
  areNotificationsAvailable,
  requestNotificationPermissions,
  scheduleDailyVerse,
  cancelDailyVerse,
  getNotificationSettings,
} from '../services/notificationService';
import { seedPopularVerses } from '../services/offlineService';
import GradientHeader from '../components/GradientHeader';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useAppStore();
  const { user, logout, firebaseConfigured } = useAuthStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState({ hour: 8, minute: 0 });
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);

  useEffect(() => {
    loadSettings();
    setNotificationsAvailable(areNotificationsAvailable());
  }, []);

  const loadSettings = async () => {
    const settings = await getNotificationSettings();
    setNotificationsEnabled(settings.enabled);
    setNotificationTime({ hour: settings.hour, minute: settings.minute });
  };

  const handleToggleNotifications = async (value) => {
    if (!notificationsAvailable) {
      Alert.alert(
        'Notificaciones No Disponibles',
        'Las notificaciones no están disponibles en Expo Go. Para usar esta función necesitas un development build.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permisos Requeridos',
          'Necesitas habilitar las notificaciones en la configuración de tu dispositivo.'
        );
        return;
      }
      await scheduleDailyVerse(notificationTime.hour, notificationTime.minute);
      setNotificationsEnabled(true);
    } else {
      await cancelDailyVerse();
      setNotificationsEnabled(false);
    }
  };

  const handleSeedDatabase = () => {
    Alert.alert(
      'Cargar Versículos Populares',
      '¿Deseas cargar versículos populares para uso offline?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cargar',
          onPress: async () => {
            await seedPopularVerses();
            Alert.alert('Éxito', 'Versículos cargados correctamente');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader title="Ajustes" subtitle="Personaliza tu experiencia" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {firebaseConfigured && user && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta</Text>
            <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    {user.displayName || 'Mi cuenta'}
                  </Text>
                  <Text style={[styles.warningText, { color: colors.textLight }]}>
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: colors.surface }]}
              onPress={handleLogout}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="log-out-outline" size={24} color={colors.danger} />
                <Text style={[styles.settingText, { color: colors.danger }]}>
                  Cerrar sesión
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={theme === 'oscuro' ? 'moon' : 'sunny'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingText, { color: colors.text }]}>Modo Oscuro</Text>
            </View>
            <Switch
              value={theme === 'oscuro'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notificaciones</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Versículo Diario
                </Text>
                {!notificationsAvailable && (
                  <Text style={[styles.warningText, { color: colors.textLight }]}>
                    Requiere development build
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              disabled={!notificationsAvailable}
            />
          </View>

          {notificationsEnabled && notificationsAvailable && (
            <Text style={[styles.settingDescription, { color: colors.textLight }]}>
              Recibirás un versículo cada día a las {notificationTime.hour}:
              {notificationTime.minute.toString().padStart(2, '0')}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Modo Offline</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={handleSeedDatabase}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Cargar Versículos Populares
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
          </TouchableOpacity>
          <Text style={[styles.settingDescription, { color: colors.textLight }]}>
            Descarga versículos populares para acceder sin conexión
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acerca de</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Biblia Help · RV1960
              </Text>
            </View>
            <Text style={[styles.warningText, { color: colors.textLight }]}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  warningText: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 16,
  },
});
