import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import XPBar from '../components/XPBar';
import LevelUpModal from '../components/LevelUpModal';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getRankForLevel, getXpForLevel } from '../constants/gameConfig';

export default function HomeScreen() {
  const { state, dismissLevelUp } = useGame();
  const { level, xp, totalXp, completedQuestsCount, showLevelUp, levelUpData, quests } = state;
  const rank = getRankForLevel(level);
  const xpNeeded = getXpForLevel(level);
  const activeQuests = quests.filter((q) => !q.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.systemTag}>[ STATUS WINDOW ]</Text>
          <Text style={styles.appTitle}>SOLO LEVELING</Text>
          <Text style={styles.appSubtitle}>FITNESS SYSTEM</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={COLORS.primary} />
              </View>
              <View style={[styles.rankCircle, { borderColor: rank.color }]}>
                <Text style={[styles.rankCircleText, { color: rank.color }]}>{rank.rank}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.hunterTitle}>HUNTER</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>LV.</Text>
                <Text style={styles.levelNumber}>{level}</Text>
              </View>
              <View style={[styles.rankTag, { borderColor: rank.color, backgroundColor: rank.color + '22' }]}>
                <Text style={[styles.rankTagText, { color: rank.color }]}>{rank.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.xpSection}>
            <XPBar xp={xp} level={level} />
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>[ STATISTICS ]</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{totalXp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-circle" size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{completedQuestsCount}</Text>
            <Text style={styles.statLabel}>COMPLETED</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{activeQuests}</Text>
            <Text style={styles.statLabel}>ACTIVE</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>{xpNeeded - xp}</Text>
            <Text style={styles.statLabel}>XP TO LVL</Text>
          </View>
        </View>

        {/* Ranks Guide */}
        <Text style={styles.sectionTitle}>[ HUNTER RANKS ]</Text>
        <View style={styles.ranksCard}>
          {[
            { rank: 'E', levels: '1-9',   color: '#888888' },
            { rank: 'D', levels: '10-19',  color: '#00d4ff' },
            { rank: 'C', levels: '20-29',  color: '#00ff88' },
            { rank: 'B', levels: '30-39',  color: '#7b2fff' },
            { rank: 'A', levels: '40-49',  color: '#ff8800' },
            { rank: 'S', levels: '50+',    color: '#ffaa00' },
          ].map((r) => (
            <View key={r.rank} style={styles.rankRow}>
              <View style={[styles.rankDot, { backgroundColor: r.color }]} />
              <Text style={[styles.rankRowRank, { color: r.color }]}>{r.rank}-Class</Text>
              <Text style={styles.rankRowLevels}>Level {r.levels}</Text>
              {level >= parseInt(r.levels.split('-')[0]) &&
                level <= (r.levels.includes('+') ? 999 : parseInt(r.levels.split('-')[1])) && (
                  <View style={[styles.currentBadge, { backgroundColor: r.color + '33', borderColor: r.color }]}>
                    <Text style={[styles.currentBadgeText, { color: r.color }]}>CURRENT</Text>
                  </View>
                )}
            </View>
          ))}
        </View>
      </ScrollView>

      <LevelUpModal visible={showLevelUp} levelUpData={levelUpData} onDismiss={dismissLevelUp} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  systemTag: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  appTitle: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.black,
    letterSpacing: 6,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 4,
    marginTop: SPACING.xs,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  rankCircle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankCircleText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.black,
  },
  profileInfo: {
    flex: 1,
  },
  hunterTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  levelLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginRight: SPACING.xs,
  },
  levelNumber: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.display,
    fontWeight: FONTS.weights.black,
    lineHeight: FONTS.sizes.display * 1.1,
  },
  rankTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
  rankTagText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  xpSection: {
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 3,
    marginBottom: SPACING.md,
    fontWeight: FONTS.weights.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.black,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 2,
    fontWeight: FONTS.weights.bold,
  },
  ranksCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rankDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  rankRowRank: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    width: 80,
    letterSpacing: 1,
  },
  rankRowLevels: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    flex: 1,
  },
  currentBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
  currentBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
});
