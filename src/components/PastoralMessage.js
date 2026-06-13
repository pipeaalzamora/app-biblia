import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

export default function PastoralMessage({ mensaje }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  if (!mensaje) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <Ionicons name="heart" size={16} color={colors.onPrimary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Palabra de aliento
        </Text>
      </View>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {mensaje}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
});
