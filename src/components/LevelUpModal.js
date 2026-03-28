import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getRankForLevel } from '../constants/gameConfig';

export default function LevelUpModal({ visible, levelUpData, onDismiss }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      glowAnim.setValue(0);
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
            Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
          ]),
          { iterations: 5 }
        ),
      ]).start();
    }
  }, [visible]);

  if (!levelUpData) return null;
  const rank = getRankForLevel(levelUpData.newLevel);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.secondary + '44', COLORS.primary + 'aa'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.panel,
            {
              transform: [{ scale: scaleAnim }],
              shadowColor: COLORS.primary,
              shadowOpacity: 0.8,
            },
          ]}
        >
          <Animated.View style={[styles.glowRing, { borderColor: glowColor }]} />

          <Text style={styles.systemText}>[ SYSTEM NOTIFICATION ]</Text>

          <Text style={styles.levelUpTitle}>LEVEL UP!</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>Lv. {levelUpData.newLevel}</Text>
          </View>

          <View style={[styles.rankBadge, { borderColor: rank.color }]}>
            <Text style={[styles.rankText, { color: rank.color }]}>{rank.label}</Text>
          </View>

          <Text style={styles.xpGained}>+{levelUpData.xpGained} XP gained</Text>

          <Text style={styles.message}>
            You have grown stronger, Hunter.{'\n'}Continue your path to greatness.
          </Text>

          <TouchableOpacity style={styles.okBtn} onPress={onDismiss} activeOpacity={0.8}>
            <Text style={styles.okBtnText}>ACKNOWLEDGE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '66',
    elevation: 20,
  },
  glowRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BORDER_RADIUS.xl + 4,
    borderWidth: 2,
  },
  systemText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  levelUpTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.display,
    fontWeight: FONTS.weights.black,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  levelBadge: {
    backgroundColor: COLORS.secondary + '22',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  levelNumber: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.black,
    letterSpacing: 2,
  },
  rankBadge: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  rankText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
  },
  xpGained: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    marginBottom: SPACING.lg,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    fontStyle: 'italic',
  },
  okBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  okBtnText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.black,
    letterSpacing: 3,
  },
});
