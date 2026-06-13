import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import { LIBROS_BIBLIA } from '../data/librosBiblia';
import { getChapter } from '../services/bibleApiService';
import FavoriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import GradientHeader from '../components/GradientHeader';

const VISTA = { LIBROS: 'libros', CAPITULOS: 'capitulos', LECTURA: 'lectura' };

export default function BibleReaderScreen() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  const [vista, setVista] = useState(VISTA.LIBROS);
  const [filtro, setFiltro] = useState('');
  const [libroActivo, setLibroActivo] = useState(null);
  const [capituloActivo, setCapituloActivo] = useState(null);
  const [versiculos, setVersiculos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarCapitulo = useCallback(async (libro, capitulo) => {
    setIsLoading(true);
    setError('');
    const result = await getChapter(libro.id, capitulo);
    if (result.success) {
      setVersiculos(result.versiculos);
    } else {
      setVersiculos([]);
      setError(result.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (vista === VISTA.LECTURA && libroActivo && capituloActivo) {
      cargarCapitulo(libroActivo, capituloActivo);
    }
  }, [vista, libroActivo, capituloActivo, cargarCapitulo]);

  const librosFiltrados = LIBROS_BIBLIA.filter((libro) =>
    libro.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(
        filtro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )
  );

  const abrirLibro = (libro) => {
    setLibroActivo(libro);
    setVista(VISTA.CAPITULOS);
  };

  const abrirCapitulo = (capitulo) => {
    setCapituloActivo(capitulo);
    setVista(VISTA.LECTURA);
  };

  const cambiarCapitulo = (delta) => {
    const nuevo = capituloActivo + delta;
    if (nuevo >= 1 && nuevo <= libroActivo.capitulos) {
      setCapituloActivo(nuevo);
    }
  };

  const volver = () => {
    if (vista === VISTA.LECTURA) setVista(VISTA.CAPITULOS);
    else if (vista === VISTA.CAPITULOS) setVista(VISTA.LIBROS);
  };

  const subtitulo =
    vista === VISTA.LIBROS
      ? 'Reina Valera 1960'
      : vista === VISTA.CAPITULOS
        ? `${libroActivo?.nombre} · elige capítulo`
        : `${libroActivo?.nombre} ${capituloActivo}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader
        title="Leer la Biblia"
        subtitle={subtitulo}
        right={
          vista !== VISTA.LIBROS ? (
            <TouchableOpacity onPress={volver} hitSlop={10}>
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null
        }
      />

      {vista === VISTA.LIBROS && (
        <View style={styles.body}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textLight} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar libro..."
              placeholderTextColor={colors.textLight}
              value={filtro}
              onChangeText={setFiltro}
            />
          </View>
          <FlatList
            data={librosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.bookItem, { backgroundColor: colors.surface }]}
                onPress={() => abrirLibro(item)}
                activeOpacity={0.7}
              >
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookName, { color: colors.text }]}>{item.nombre}</Text>
                  <Text style={[styles.bookMeta, { color: colors.textLight }]}>
                    {item.capitulos} {item.capitulos === 1 ? 'capítulo' : 'capítulos'} ·{' '}
                    {item.testamento === 'antiguo' ? 'A.T.' : 'N.T.'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {vista === VISTA.CAPITULOS && libroActivo && (
        <FlatList
          data={Array.from({ length: libroActivo.capitulos }, (_, i) => i + 1)}
          keyExtractor={(item) => String(item)}
          numColumns={5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chapterCell, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => abrirCapitulo(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chapterText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chapterGrid}
        />
      )}

      {vista === VISTA.LECTURA && (
        <View style={styles.body}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : error ? (
            <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
          ) : (
            <FlatList
              data={versiculos}
              keyExtractor={(item) => String(item.numero)}
              renderItem={({ item }) => (
                <View style={styles.verseRow}>
                  {item.titulo ? (
                    <Text style={[styles.studyTitle, { color: colors.primary }]}>
                      {item.titulo}
                    </Text>
                  ) : null}
                  <View style={styles.verseLine}>
                    <Text style={[styles.verseNumber, { color: colors.primary }]}>
                      {item.numero}
                    </Text>
                    <Text style={[styles.verseText, { color: colors.textSecondary }]}>
                      {item.texto}
                    </Text>
                  </View>
                  <View style={styles.verseActions}>
                    <FavoriteButton
                      verse={{ referencia: item.referencia, texto: item.texto }}
                      size={20}
                      color={colors.primary}
                    />
                    <ShareButton verse={{ referencia: item.referencia, texto: item.texto }} />
                  </View>
                </View>
              )}
              contentContainerStyle={styles.readingContent}
              ListFooterComponent={
                <View style={styles.navRow}>
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      {
                        backgroundColor: capituloActivo > 1 ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => cambiarCapitulo(-1)}
                    disabled={capituloActivo <= 1}
                  >
                    <Ionicons name="chevron-back" size={20} color={colors.onPrimary} />
                    <Text style={[styles.navText, { color: colors.onPrimary }]}>Anterior</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      {
                        backgroundColor:
                          capituloActivo < libroActivo.capitulos ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => cambiarCapitulo(1)}
                    disabled={capituloActivo >= libroActivo.capitulos}
                  >
                    <Text style={[styles.navText, { color: colors.onPrimary }]}>Siguiente</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.onPrimary} />
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  listContent: { paddingBottom: 24 },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  bookInfo: { flex: 1 },
  bookName: { fontSize: 16, fontWeight: '600' },
  bookMeta: { fontSize: 12, marginTop: 2 },
  chapterGrid: { padding: 16 },
  chapterCell: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterText: { fontSize: 16, fontWeight: '700' },
  readingContent: { paddingBottom: 32 },
  verseRow: { marginBottom: 16 },
  studyTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  verseLine: { flexDirection: 'row', gap: 8 },
  verseNumber: { fontSize: 13, fontWeight: '800', marginTop: 4, minWidth: 22 },
  verseText: { flex: 1, fontSize: 17, lineHeight: 28 },
  verseActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 2 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navText: { fontSize: 14, fontWeight: '700' },
  loader: { marginTop: 40 },
  error: { textAlign: 'center', marginTop: 40, fontSize: 15, fontWeight: '600' },
});
