import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { QUEST_DIFFICULTIES } from '../constants/gameConfig';

export default function QuestItem({ quest, onComplete, onDelete }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const difficulty = QUEST_DIFFICULTIES[quest.difficulty] || QUEST_DIFFICULTIES.NORMAL;

  const handleComplete = () => {
    if (quest.completed) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => onComplete(quest.id));
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Quest',
      `Are you sure you want to delete "${quest.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(quest.id) },
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View
        style={[
          styles.card,
          quest.completed && styles.cardCompleted,
          { borderLeftColor: quest.completed ? COLORS.success : difficulty.color },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.rankBadge, { backgroundColor: difficulty.color + '22', borderColor: difficulty.color }]}>
            <Text style={[styles.rankText, { color: difficulty.color }]}>{difficulty.label}</Text>
          </View>
          <Text style={[styles.xpReward, quest.completed && styles.textCompleted]}>
            +{difficulty.xp} XP
          </Text>
        </View>

        <Text style={[styles.title, quest.completed && styles.titleCompleted]}>
          {quest.title}
        </Text>

        {quest.description ? (
          <Text style={[styles.description, quest.completed && styles.textCompleted]}>
            {quest.description}
          </Text>
        ) : null}

        <View style={styles.actions}>
          {!quest.completed ? (
            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete} activeOpacity={0.7}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.completeBtnText}>COMPLETE</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.completedText}>COMPLETED</Text>
            </View>
          )}
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  rankBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
  rankText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  xpReward: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    marginBottom: SPACING.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.sm,
  },
  textCompleted: {
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success + '44',
    backgroundColor: COLORS.success + '11',
  },
  completeBtnText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  completedText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
});
