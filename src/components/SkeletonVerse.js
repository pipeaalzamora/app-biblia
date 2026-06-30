import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

// Placeholder animado que imita una tarjeta de versículo mientras carga.
function SkeletonCard() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animacion.start();
    return () => animacion.stop();
  }, [opacity]);

  const barra = (width) => (
    <Animated.View
      style={[
        styles.line,
        { backgroundColor: colors.border, opacity, width },
      ]}
    />
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {barra('90%')}
      {barra('100%')}
      {barra('75%')}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      {barra('40%')}
    </View>
  );
}

export default function SkeletonVerse({ count = 2 }) {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  line: {
    height: 14,
    borderRadius: 7,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
