import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';
import VerseCard from '../components/VerseCard';
import GradientHeader from '../components/GradientHeader';

export default function HistoryScreen() {
  const { history, clearHistory, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader
        title="Historial"
        subtitle="Tus búsquedas recientes"
        right={
          history.length > 0 ? (
            <TouchableOpacity onPress={clearHistory} hitSlop={10}>
              <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null
        }
      />

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            No hay historial aún
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            Tus búsquedas aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.referencia}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              {item.searchTerm ? (
                <Text style={[styles.searchTerm, { color: colors.textLight }]}>
                  Búsqueda: &quot;{item.searchTerm}&quot;
                </Text>
              ) : null}
              <VerseCard verse={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  searchTerm: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
