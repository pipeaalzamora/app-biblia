import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { TEMAS } from '../config/constantes';

export default function AuthScreen() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const { loginWithGoogle } = useAuthStore();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Ionicons name="book" size={56} color="#FFFFFF" />
        <Text style={styles.heroTitle}>Biblia Help</Text>
        <Text style={styles.heroSubtitle}>Tu refugio en la Palabra · RV1960</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>
          Te damos la bienvenida
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Inicia sesión para guardar tus favoritos, tu historial y tu racha de
          lectura en todos tus dispositivos.
        </Text>

        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleGoogle}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="logo-google" size={22} color="#EA4335" />
              <Text style={[styles.googleText, { color: colors.text }]}>
                Continuar con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {error ? (
          <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
        ) : null}

        <Text style={[styles.note, { color: colors.textLight }]}>
          Al continuar aceptas el uso de tu cuenta de Google únicamente para
          identificarte dentro de la app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingTop: 96,
    paddingBottom: 56,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 14,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 6,
  },
  body: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 28,
  },
});
