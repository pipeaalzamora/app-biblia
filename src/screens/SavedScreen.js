import React, { useState } from 'react';
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

const TABS = { FAVORITOS: 'favoritos', HISTORIAL: 'historial' };

export default function SavedScreen() {
  const { favorites, history, clearHistory, theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;
  const [tab, setTab] = useState(TABS.FAVORITOS);

  const esFavoritos = tab === TABS.FAVORITOS;
  const data = esFavoritos ? favorites : history;

  const subtitle = esFavoritos
    ? `${favorites.length} ${favorites.length === 1 ? 'versículo guardado' : 'versículos guardados'}`
    : `${history.length} ${history.length === 1 ? 'búsqueda' : 'búsquedas'}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader
        title="Guardados"
        subtitle={subtitle}
        right={
          !esFavoritos && history.length > 0 ? (
            <TouchableOpacity
              onPress={clearHistory}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Borrar historial"
            >
              <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.segment}>
        {[
          { id: TABS.FAVORITOS, label: 'Favoritos', icon: 'star' },
          { id: TABS.HISTORIAL, label: 'Historial', icon: 'time' },
        ].map((item) => {
          const active = tab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.segmentButton,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setTab(item.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={active ? item.icon : `${item.icon}-outline`}
                size={16}
                color={active ? colors.onPrimary : colors.text}
              />
              <Text
                style={[
                  styles.segmentText,
                  { color: active ? colors.onPrimary : colors.text },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={esFavoritos ? 'star-outline' : 'time-outline'}
            size={48}
            color={colors.textLight}
          />
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            {esFavoritos ? 'No tienes favoritos aún' : 'No hay historial aún'}
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            {esFavoritos
              ? 'Toca la estrella en un versículo para guardarlo'
              : 'Tus búsquedas aparecerán aquí'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.referencia}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              {!esFavoritos && item.searchTerm ? (
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
  container: { flex: 1 },
  segment: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
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
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
