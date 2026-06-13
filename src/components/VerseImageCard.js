import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

const VerseImageCard = forwardRef(({ verse }, ref) => {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  return (
    // El wrapper queda fuera de pantalla pero SIGUE montado con opacidad real
    // (no opacity:0, para que la captura tenga píxeles). `collapsable={false}`
    // evita que Android elimine/aplane la vista, causa del error
    // "No view found with reactTag".
    <View style={styles.offscreen} pointerEvents="none">
      <View
        ref={ref}
        collapsable={false}
        renderToHardwareTextureAndroid
        style={styles.container}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.text}>{verse.texto}</Text>
            <Text style={styles.reference}>{verse.referencia}</Text>
            <Text style={styles.watermark}>Biblia Help</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
});

VerseImageCard.displayName = 'VerseImageCard';

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
  container: {
    width: 400,
    height: 600,
  },
  gradient: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  reference: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  watermark: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});

export default VerseImageCard;
