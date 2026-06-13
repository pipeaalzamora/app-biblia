import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { getDailyVerse, markVerseAsRead } from '../services/dailyVerseService';
import VerseCard from '../components/VerseCard';
import GradientHeader from '../components/GradientHeader';

export default function DailyVerseScreen() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const [dailyVerse, setDailyVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    setIsLoading(true);
    try {
      const { verse, streak: currentStreak } = await getDailyVerse();
      setDailyVerse(verse);
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error cargando versículo diario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    await markVerseAsRead();
    await loadDailyVerse();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <GradientHeader title="Devocional" subtitle="Versículo del día" />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader
        title="Devocional"
        subtitle={new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {streak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="flame" size={24} color="#FFF" />
            <Text style={styles.streakText}>
              {streak} {streak === 1 ? 'día' : 'días'} de racha
            </Text>
          </View>
        )}

        {dailyVerse && (
          <View style={styles.verseContainer}>
            <VerseCard verse={dailyVerse} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleMarkAsRead}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Marcar como Leído</Text>
        </TouchableOpacity>

        <View style={styles.motivationContainer}>
          <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
            La palabra de Dios es viva y eficaz
          </Text>
          <Text style={[styles.motivationReference, { color: colors.textLight }]}>
            Hebreos 4:12
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: 24,
    alignSelf: 'center',
    gap: 8,
  },
  streakText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  verseContainer: {
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  motivationContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  motivationText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  motivationReference: {
    fontSize: 14,
  },
  loader: {
    marginTop: 100,
  },
});
