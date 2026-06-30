import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { TEMAS } from '../config/constantes';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SavedScreen from '../screens/SavedScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BibleReaderScreen from '../screens/BibleReaderScreen';
import AuthScreen from '../screens/AuthScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Leer') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Guardados') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Ajustes') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Leer" component={BibleReaderScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Guardados" component={SavedScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const { user, initializing, authRequired, init } = useAuthStore();

  useEffect(() => {
    const unsubscribe = init();
    return () => unsubscribe && unsubscribe();
  }, [init]);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Exige sesión solo cuando el login está disponible (Firebase + build nativo).
  const requiereLogin = authRequired && !user;

  return (
    <NavigationContainer>
      {requiereLogin ? <AuthScreen /> : <MainTabs />}
    </NavigationContainer>
  );
}
