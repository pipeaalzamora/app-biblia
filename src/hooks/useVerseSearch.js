import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  getVersesForTopic,
  searchVerses,
} from '../services/bibleApiService';
import { detectarTema, obtenerTemaPorId } from '../data/temasVersiculos';
import { useAppStore } from '../store/useAppStore';
import { saveVerseOffline, searchOfflineVerses } from '../services/offlineService';
import { sugerirVersiculosIA } from '../services/aiService';

const LOADING_STATES = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  SUCCESS: 'success',
  ERROR: 'error',
};

const LOADING_MESSAGE = 'Buscando en la Palabra...';

export const useVerseSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVerses, setCurrentVerses] = useState([]);
  const [pastoralMessage, setPastoralMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);

  const { addToHistory } = useAppStore();

  const isLoading = loadingState === LOADING_STATES.SEARCHING;
  const loadingMessage = isLoading ? LOADING_MESSAGE : '';

  const resetResults = () => {
    setErrorMessage('');
    setCurrentVerses([]);
    setPastoralMessage('');
  };

  const finalizarConVersiculos = async (versiculos, mensaje, termino) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentVerses(versiculos);
    setPastoralMessage(mensaje || '');
    setLoadingState(LOADING_STATES.SUCCESS);

    if (versiculos[0]) addToHistory(versiculos[0], termino);
    for (const verse of versiculos) {
      await saveVerseOffline(verse, termino);
    }
  };

  // Búsqueda por tema seleccionado (chips).
  const searchByTopicId = async (temaId) => {
    const tema = obtenerTemaPorId(temaId);
    if (!tema) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoadingState(LOADING_STATES.SEARCHING);
    resetResults();

    const resultado = await getVersesForTopic(tema);

    if (resultado.success) {
      await finalizarConVersiculos(resultado.versiculos, resultado.mensaje, tema.nombre);
    } else {
      await mostrarFallbackOffline(tema.nombre, resultado.error);
    }
  };

  const mostrarFallbackOffline = async (termino, errorBase) => {
    const offline = await searchOfflineVerses(termino);
    if (offline.length > 0) {
      setCurrentVerses(offline);
      setErrorMessage('Sin conexión: mostrando versículos guardados.');
      setLoadingState(LOADING_STATES.SUCCESS);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(errorBase || 'No se encontraron versículos. Intenta de nuevo.');
      setLoadingState(LOADING_STATES.ERROR);
    }
  };

  // Búsqueda libre: detecta tema; si no, hace búsqueda de texto en la API.
  const handleSearch = async () => {
    const termino = searchTerm.trim();

    if (!termino) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setErrorMessage('Cuéntame cómo te sientes o escribe una palabra para buscar.');
      setCurrentVerses([]);
      setPastoralMessage('');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoadingState(LOADING_STATES.SEARCHING);
    resetResults();

    const tema = detectarTema(termino);

    if (tema) {
      const resultado = await getVersesForTopic(tema);
      if (resultado.success) {
        await finalizarConVersiculos(resultado.versiculos, resultado.mensaje, termino);
        return;
      }
    }

    // Respaldo con IA (si está configurada): entiende texto libre que la
    // detección local no captó.
    const ia = await sugerirVersiculosIA(termino);
    if (ia.success && ia.versiculos.length > 0) {
      await finalizarConVersiculos(ia.versiculos, ia.mensaje, termino);
      return;
    }

    const resultado = await searchVerses(termino, { take: 15 });
    if (resultado.success && resultado.versiculos.length > 0) {
      await finalizarConVersiculos(resultado.versiculos, '', termino);
    } else {
      await mostrarFallbackOffline(termino, resultado.error);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    resetResults();
    setLoadingState(LOADING_STATES.IDLE);
  };

  return {
    searchTerm,
    setSearchTerm,
    currentVerses,
    pastoralMessage,
    errorMessage,
    isLoading,
    loadingMessage,
    loadingState,
    handleSearch,
    searchByTopicId,
    clearSearch,
  };
};
