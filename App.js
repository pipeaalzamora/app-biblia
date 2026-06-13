import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/services/offlineService';

export default function App() {
  const { loadPersistedData } = useAppStore();

  useEffect(() => {
    const initialize = async () => {
      await loadPersistedData();
      await initDatabase();
    };

    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
