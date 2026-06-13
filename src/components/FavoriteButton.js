import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';

export default function FavoriteButton({ verse, size = 22, color = '#5B6CF0' }) {
  const { isFavorite, addFavorite, removeFavorite } = useAppStore();
  const favorite = isFavorite(verse?.referencia);

  const handlePress = async () => {
    if (!verse) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (favorite) {
      removeFavorite(verse.referencia);
    } else {
      addFavorite(verse);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name={favorite ? 'star' : 'star-outline'} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
