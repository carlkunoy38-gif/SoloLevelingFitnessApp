import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import QuestItem from '../components/QuestItem';
import AddQuestModal from '../components/AddQuestModal';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

const FILTERS = ['ALL', 'ACTIVE', 'COMPLETED'];

export default function QuestScreen() {
  const { state, addQuest, deleteQuest, completeQuest } = useGame();
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const filtered = state.quests.filter((q) => {
    if (filter === 'ACTIVE') return !q.completed;
    if (filter === 'COMPLETED') return q.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.systemTag}>[ QUEST BOARD ]</Text>
          <Text style={styles.title}>DAILY QUESTS</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quest Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filtered.length} {filtered.length === 1 ? 'QUEST' : 'QUESTS'}
        </Text>
      </View>

      {/* Quest List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestItem
            quest={item}
            onComplete={completeQuest}
            onDelete={deleteQuest}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>NO QUESTS FOUND</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'COMPLETED'
                ? 'Complete some quests to see them here'
                : 'Create a new quest to get started'}
            </Text>
          </View>
        }
      />

      <AddQuestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addQuest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  systemTag: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.black,
    letterSpacing: 4,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary + '22',
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  filterTextActive: {
    color: COLORS.primary,
  },
  countRow: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 2,
    fontWeight: FONTS.weights.bold,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 3,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.xl,
  },
});
