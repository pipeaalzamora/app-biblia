// Configuración de la aplicación
import { Platform } from 'react-native';

export const CONFIGURACION = {
  // API bíblica pública (Reina Valera 1960). Se usa directamente desde la app.
  URL_BIBLE_API: 'https://bible-api.deno.dev/api',

  // Endpoint de IA OPCIONAL (respaldo semántico). Si está vacío, la app usa
  // solo la detección local de temas. Para activarlo, hospeda un endpoint que
  // reciba { userInput } y devuelva { mensaje, versiculos:[{libro,capitulo,versiculo}] }.
  URL_IA: process.env.EXPO_PUBLIC_AI_URL || '',

  // Configuración de caché
  DURACION_CACHE: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  MAX_ITEMS_HISTORIAL: 50,

  // Timeouts
  TIMEOUT_BIBLE_API: 10000,

  // Versión de la Biblia (Reina Valera 1960)
  VERSION_BIBLIA: 'rv1960',
  NOMBRE_VERSION: 'RV1960',
};

// Tipografía. Para el texto bíblico usamos una serif del sistema (sin assets):
// transmite una sensación de "escritura" más cálida y legible.
export const TIPOGRAFIA = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
};

// Escalas de tamaño de fuente para accesibilidad.
export const ESCALAS_FUENTE = {
  pequena: 0.9,
  normal: 1,
  grande: 1.15,
  extra: 1.3,
};

// Paleta de colores y sistema de diseño
export const TEMAS = {
  claro: {
    background: '#F4F6FB',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF2FB',
    primary: '#5B6CF0',
    primaryDark: '#4453D6',
    accent: '#8B5CF6',
    gradientStart: '#5B6CF0',
    gradientEnd: '#8B5CF6',
    text: '#1E2436',
    textSecondary: '#3C4257',
    textLight: '#8A92A6',
    border: '#E3E8F2',
    success: '#22C55E',
    danger: '#EF4444',
    shadow: '#1E2436',
    onPrimary: '#FFFFFF',
  },
  oscuro: {
    background: '#0E1117',
    surface: '#171B26',
    surfaceAlt: '#1F2536',
    primary: '#7C8AFF',
    primaryDark: '#5B6CF0',
    accent: '#A78BFA',
    gradientStart: '#4453D6',
    gradientEnd: '#7C3AED',
    text: '#ECEFF6',
    textSecondary: '#C2C8D6',
    textLight: '#7A8294',
    border: '#262C3B',
    success: '#34D399',
    danger: '#F87171',
    shadow: '#000000',
    onPrimary: '#FFFFFF',
  },
};
