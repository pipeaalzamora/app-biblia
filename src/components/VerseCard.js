import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import ShareImageButton from './ShareImageButton';
import VerseImageCard from './VerseImageCard';
import { useAppStore } from '../store/useAppStore';
import { TEMAS, TIPOGRAFIA } from '../config/constantes';

export default function VerseCard({ verse }) {
  const imageCardRef = useRef(null);
  const { theme, fontScale } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const escala = fontScale || 1;

  if (!verse) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Ionicons
        name="bookmark"
        size={18}
        color={colors.primary}
        style={styles.accent}
      />

      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontFamily: TIPOGRAFIA.serif,
            fontSize: 19 * escala,
            lineHeight: 30 * escala,
          },
        ]}
      >
        {verse.texto}
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <Text style={[styles.reference, { color: colors.primary }]}>
          {verse.referencia}
        </Text>
        <View style={styles.actions}>
          <FavoriteButton verse={verse} color={colors.primary} />
          <ShareButton verse={verse} />
          <ShareImageButton viewRef={imageCardRef} />
        </View>
      </View>

      <VerseImageCard ref={imageCardRef} verse={verse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    paddingTop: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  accent: {
    marginBottom: 10,
  },
  text: {
    fontSize: 19,
    lineHeight: 30,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
