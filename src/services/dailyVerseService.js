import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVersesByReference } from './bibleApiService';
import { getPopularVerses } from './offlineService';

const DAILY_VERSE_KEY = '@daily_verse';
const STREAK_KEY = '@reading_streak';
const LAST_READ_KEY = '@last_read_date';

// Pool de referencias devocionales (RV1960) que se consultan a la API.
const REFERENCIAS_DIARIAS = [
  { libro: 'juan', capitulo: 3, versiculo: 16 },
  { libro: 'filipenses', capitulo: 4, versiculo: 13 },
  { libro: 'salmos', capitulo: 23, versiculo: 1 },
  { libro: 'jeremias', capitulo: 29, versiculo: 11 },
  { libro: 'proverbios', capitulo: 3, versiculo: '5-6' },
  { libro: 'isaias', capitulo: 41, versiculo: 10 },
  { libro: 'romanos', capitulo: 8, versiculo: 28 },
  { libro: 'mateo', capitulo: 11, versiculo: 28 },
  { libro: 'salmos', capitulo: 46, versiculo: 1 },
  { libro: 'josue', capitulo: 1, versiculo: 9 },
  { libro: 'filipenses', capitulo: 4, versiculo: '6-7' },
  { libro: 'salmos', capitulo: 121, versiculo: '1-2' },
  { libro: 'isaias', capitulo: 40, versiculo: 31 },
  { libro: '1-corintios', capitulo: 13, versiculo: '4-7' },
  { libro: 'salmos', capitulo: 27, versiculo: 1 },
];

const VERSICULO_RESPALDO = {
  referencia: 'Juan 3:16 RV1960',
  texto:
    'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
};

// Índice estable según el día del año, para que todos vean el mismo versículo.
const indiceDelDia = () => {
  const ahora = new Date();
  const inicioAnio = new Date(ahora.getFullYear(), 0, 0);
  const dia = Math.floor((ahora - inicioAnio) / (1000 * 60 * 60 * 24));
  return dia % REFERENCIAS_DIARIAS.length;
};

export const getDailyVerse = async () => {
  try {
    const today = new Date().toDateString();
    const storedData = await AsyncStorage.getItem(DAILY_VERSE_KEY);

    if (storedData) {
      const { date, verse } = JSON.parse(storedData);
      if (date === today) {
        return { verse, streak: await getStreak() };
      }
    }

    const referencia = REFERENCIAS_DIARIAS[indiceDelDia()];
    const resultado = await getVersesByReference(referencia);

    let verse = VERSICULO_RESPALDO;
    if (resultado.success && resultado.versiculos.length > 0) {
      verse = resultado.versiculos[0];
    } else {
      // Sin conexión: intenta usar versículos populares guardados.
      const populares = await getPopularVerses(50);
      if (populares.length > 0) {
        verse = populares[indiceDelDia() % populares.length];
      }
    }

    await AsyncStorage.setItem(
      DAILY_VERSE_KEY,
      JSON.stringify({ date: today, verse })
    );

    return { verse, streak: await getStreak() };
  } catch (error) {
    console.error('Error obteniendo versículo diario:', error);
    return { verse: VERSICULO_RESPALDO, streak: 0 };
  }
};

export const markVerseAsRead = async () => {
  try {
    const today = new Date().toDateString();
    await updateStreak();
    await AsyncStorage.setItem(LAST_READ_KEY, today);
  } catch (error) {
    console.error('Error marcando versículo como leído:', error);
  }
};

const getStreak = async () => {
  try {
    const streakData = await AsyncStorage.getItem(STREAK_KEY);
    return streakData ? parseInt(streakData, 10) : 0;
  } catch (error) {
    return 0;
  }
};

const updateStreak = async () => {
  try {
    const lastReadDate = await AsyncStorage.getItem(LAST_READ_KEY);
    const today = new Date();

    if (!lastReadDate) {
      await AsyncStorage.setItem(STREAK_KEY, '1');
      return;
    }

    const lastRead = new Date(lastReadDate);
    const diffDays = Math.floor((today - lastRead) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return;
    } else if (diffDays === 1) {
      const currentStreak = await getStreak();
      await AsyncStorage.setItem(STREAK_KEY, String(currentStreak + 1));
    } else {
      await AsyncStorage.setItem(STREAK_KEY, '1');
    }
  } catch (error) {
    console.error('Error actualizando racha:', error);
  }
};
