import React from 'react';
import { TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function ShareButton({ verse, style }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const handleShare = async () => {
    if (!verse) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const message = `"${verse.texto}"\n\n${verse.referencia}`;

    try {
      await Share.share({
        title: verse.referencia,
        message,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir el versículo');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={[styles.button, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="share-social-outline" size={22} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
