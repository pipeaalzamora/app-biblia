import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { saveVerseOffline } from '../services/offlineService';
import { getVersesByReference, searchVerses } from '../services/bibleApiService';
import GradientHeader from '../components/GradientHeader';
import VerseCard from '../components/VerseCard';

export default function SearchScreen() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const [searchMode, setSearchMode] = useState('text');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [results, setResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setStatusMessage('');
    setErrorMessage('');

    const result = await searchVerses(searchTerm, { take: 25 });

    if (result.success && result.versiculos.length > 0) {
      setResults(result.versiculos);
      setStatusMessage(
        result.meta
          ? `${result.meta.total} coincidencias en RV1960`
          : `${result.versiculos.length} resultados`
      );
      for (const item of result.versiculos) {
        await saveVerseOffline(item, `busqueda:${searchTerm}`);
      }
    } else {
      setResults([]);
      setErrorMessage(result.error || 'No se encontraron resultados.');
    }

    setIsLoading(false);
  };

  const handleReferenceSearch = async () => {
    if (!selectedBook.trim() || !chapter.trim() || !verse.trim()) {
      setErrorMessage('Ingresa libro, capítulo y versículo.');
      setStatusMessage('');
      setResults([]);
      return;
    }

    setIsLoading(true);
    setStatusMessage('');
    setErrorMessage('');

    const result = await getVersesByReference({
      libro: selectedBook,
      capitulo: chapter,
      versiculo: verse,
    });

    if (result.success && result.versiculos.length > 0) {
      setResults(result.versiculos);
      setStatusMessage('Resultado obtenido desde la API bíblica (RV1960).');
      for (const item of result.versiculos) {
        await saveVerseOffline(item, `referencia:${selectedBook}`);
      }
    } else {
      setResults([]);
      setErrorMessage(result.error || 'No se encontró esa referencia.');
    }

    setIsLoading(false);
  };

  const hasSearchInput =
    searchMode === 'text'
      ? Boolean(searchTerm.trim())
      : Boolean(selectedBook.trim() || chapter.trim() || verse.trim());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader title="Búsqueda" subtitle="Explora la Palabra (RV1960)" />

      <View style={styles.body}>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              { backgroundColor: searchMode === 'text' ? colors.primary : colors.surface },
            ]}
            onPress={() => setSearchMode('text')}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: searchMode === 'text' ? colors.onPrimary : colors.text },
              ]}
            >
              Por palabra
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              { backgroundColor: searchMode === 'reference' ? colors.primary : colors.surface },
            ]}
            onPress={() => setSearchMode('reference')}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: searchMode === 'reference' ? colors.onPrimary : colors.text },
              ]}
            >
              Por referencia
            </Text>
          </TouchableOpacity>
        </View>

        {searchMode === 'text' ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, flex: 1 }]}
              placeholder="Buscar palabra o frase en la Biblia..."
              placeholderTextColor={colors.textLight}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleTextSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              onPress={handleTextSearch}
            >
              <Ionicons name="search" size={22} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookSearchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Libro</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="ej: juan, salmos, 1-corintios"
              placeholderTextColor={colors.textLight}
              value={selectedBook}
              onChangeText={setSelectedBook}
              autoCapitalize="none"
            />

            <View style={styles.referenceRow}>
              <View style={styles.referenceInput}>
                <Text style={[styles.label, { color: colors.text }]}>Capítulo</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="ej: 3"
                  placeholderTextColor={colors.textLight}
                  value={chapter}
                  onChangeText={setChapter}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.referenceInput}>
                <Text style={[styles.label, { color: colors.text }]}>Versículo</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="ej: 16 o 6-7"
                  placeholderTextColor={colors.textLight}
                  value={verse}
                  onChangeText={setVerse}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.fullButton, { backgroundColor: colors.primary }]}
              onPress={handleReferenceSearch}
            >
              <Text style={[styles.searchButtonText, { color: colors.onPrimary }]}>
                Buscar Referencia
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {statusMessage ? (
          <Text style={[styles.statusText, { color: colors.textLight }]}>{statusMessage}</Text>
        ) : null}

        {errorMessage ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text>
        ) : null}

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.referencia}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <VerseCard verse={item} />
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {hasSearchInput
                  ? 'No se encontraron resultados'
                  : 'Realiza una búsqueda para ver resultados'}
              </Text>
            }
            contentContainerStyle={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  bookSearchContainer: {
    marginBottom: 12,
  },
  referenceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  referenceInput: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  loader: {
    marginTop: 32,
  },
  statusText: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsList: {
    paddingBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});
