import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { CATALOGO_TEMAS } from '../data/temasVersiculos';

export default function TopicChips({ selectedId, onSelect }) {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATALOGO_TEMAS.map((tema) => {
        const active = selectedId === tema.id;
        return (
          <TouchableOpacity
            key={tema.id}
            onPress={() => onSelect(tema.id)}
            activeOpacity={0.8}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.surface,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name={tema.icono}
              size={16}
              color={active ? colors.onPrimary : colors.primary}
            />
            <Text
              style={[
                styles.label,
                { color: active ? colors.onPrimary : colors.text },
              ]}
            >
              {tema.nombre}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
