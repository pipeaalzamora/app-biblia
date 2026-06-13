import React, { useState } from 'react';
import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function ShareImageButton({ viewRef }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShareImage = async () => {
    if (!viewRef || !viewRef.current) {
      Alert.alert('Error', 'No se pudo capturar la imagen');
      return;
    }

    try {
      setIsGenerating(true);

      // En Android la vista fuera de pantalla puede no estar lista en el primer
      // intento; reintentamos con una breve espera.
      const capture = () =>
        captureRef(viewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

      let uri;
      try {
        uri = await capture();
      } catch (firstError) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        uri = await capture();
      }

      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartir versículo',
        });
      } else {
        Alert.alert('Error', 'No se puede compartir en este dispositivo');
      }
    } catch (error) {
      console.error('Error compartiendo imagen:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShareImage}
      disabled={isGenerating}
      style={{ padding: 8 }}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Ionicons name="image-outline" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}
