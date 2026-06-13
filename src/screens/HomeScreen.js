import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { obtenerTemaPorId } from '../data/temasVersiculos';
import VerseCard from '../components/VerseCard';
import PastoralMessage from '../components/PastoralMessage';
import ThemeToggle from '../components/ThemeToggle';
import GradientHeader from '../components/GradientHeader';
import TopicChips from '../components/TopicChips';
import { useVerseSearch } from '../hooks/useVerseSearch';

export default function HomeScreen() {
  const inputRef = useRef(null);
  const [selectedTopic, setSelectedTopic] = React.useState(null);

  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const {
    searchTerm,
    setSearchTerm,
    currentVerses,
    pastoralMessage,
    errorMessage,
    isLoading,
    loadingMessage,
    handleSearch,
    searchByTopicId,
    clearSearch,
  } = useVerseSearch();

  const handleTopicSelect = (temaId) => {
    setSelectedTopic(temaId);
    searchByTopicId(temaId);
  };

  const handleClear = () => {
    setSelectedTopic(null);
    clearSearch();
  };

  const hasResults = !isLoading && currentVerses.length > 0;
  const selectedTema = selectedTopic ? obtenerTemaPorId(selectedTopic) : null;
  const resultsTitle = selectedTema ? selectedTema.nombre : 'Resultados';

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <GradientHeader
        title="Biblia Help"
        subtitle="Encuentra consuelo en la Palabra"
        right={<ThemeToggle />}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchBlock}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                },
              ]}
              placeholder="Cuéntame cómo te sientes hoy..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSearch}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Ionicons name="search" size={20} color={colors.onPrimary} />
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
                {isLoading ? 'Buscando...' : 'Buscar Consuelo'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textLight }]}>
            O elige un tema
          </Text>
          <TopicChips selectedId={selectedTopic} onSelect={handleTopicSelect} />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              {loadingMessage ? (
                <Text style={[styles.loadingText, { color: colors.primary }]}>
                  {loadingMessage}
                </Text>
              ) : null}
            </View>
          )}

          {hasResults && (
            <>
              <View style={styles.resultsHeader}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>
                  {resultsTitle}
                </Text>
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textLight} />
                  <Text style={[styles.clearText, { color: colors.textLight }]}>
                    Limpiar
                  </Text>
                </TouchableOpacity>
              </View>

              {pastoralMessage ? (
                <View style={styles.block}>
                  <PastoralMessage mensaje={pastoralMessage} />
                </View>
              ) : null}

              {currentVerses.map((verse, index) => (
                <View
                  key={`${verse.referencia}-${index}`}
                  style={styles.verseWrapper}
                >
                  <VerseCard verse={verse} />
                </View>
              ))}
            </>
          )}

          {!isLoading && errorMessage ? (
            <Text style={[styles.message, { color: colors.textLight }]}>
              {errorMessage}
            </Text>
          ) : null}

          {!isLoading && !errorMessage && currentVerses.length === 0 ? (
            <View style={styles.placeholder}>
              <Ionicons name="book-outline" size={48} color={colors.textLight} />
              <Text style={[styles.placeholderText, { color: colors.textLight }]}>
                Escribe cómo te sientes o elige un tema para recibir versículos.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <StatusBar style="light" />
      </KeyboardAvoidingView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchBlock: {
    paddingHorizontal: 16,
  },
  input: {
    minHeight: isSmallDevice ? 72 : 88,
    maxHeight: 140,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#5B6CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
  block: {
    paddingHorizontal: 16,
  },
  verseWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  placeholder: {
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 32,
    gap: 12,
  },
  placeholderText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
