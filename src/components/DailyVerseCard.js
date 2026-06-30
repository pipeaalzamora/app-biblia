import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS, TIPOGRAFIA } from '../config/constantes';
import { getDailyVerse, markVerseAsRead } from '../services/dailyVerseService';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';

// Tarjeta del versículo del día, pensada para la pantalla de Inicio.
export default function DailyVerseCard() {
  const { theme, fontScale } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const escala = fontScale || 1;

  const [verse, setVerse] = useState(null);
  const [streak, setStreak] = useState(0);
  const [leido, setLeido] = useState(false);

  const cargar = async () => {
    const { verse: v, streak: s } = await getDailyVerse();
    setVerse(v);
    setStreak(s);
  };

  useEffect(() => {
    cargar();
  }, []);

  const marcarLeido = async () => {
    await markVerseAsRead();
    setLeido(true);
    await cargar();
  };

  if (!verse) return null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sunny" size={18} color={colors.primary} />
          <Text style={[styles.headerText, { color: colors.primary }]}>
            Versículo del día
          </Text>
        </View>
        {streak > 0 ? (
          <View style={[styles.streak, { backgroundColor: colors.primary }]}>
            <Ionicons name="flame" size={14} color={colors.onPrimary} />
            <Text style={[styles.streakText, { color: colors.onPrimary }]}>
              {streak}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontFamily: TIPOGRAFIA.serif,
            fontSize: 18 * escala,
            lineHeight: 28 * escala,
          },
        ]}
      >
        {verse.texto}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.reference, { color: colors.primary }]}>
          {verse.referencia}
        </Text>
        <View style={styles.actions}>
          <FavoriteButton verse={verse} color={colors.primary} />
          <ShareButton verse={verse} />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.readButton,
          { backgroundColor: leido ? colors.surfaceAlt : colors.primary },
        ]}
        onPress={marcarLeido}
        disabled={leido}
        accessibilityRole="button"
        accessibilityLabel="Marcar versículo del día como leído"
      >
        <Ionicons
          name={leido ? 'checkmark-done' : 'checkmark-circle'}
          size={18}
          color={leido ? colors.primary : colors.onPrimary}
        />
        <Text
          style={[
            styles.readText,
            { color: leido ? colors.primary : colors.onPrimary },
          ]}
        >
          {leido ? 'Leído hoy' : 'Marcar como leído'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
  },
  text: {
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  reference: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  readText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
