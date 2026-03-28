import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getXpForLevel } from '../constants/gameConfig';

export default function XPBar({ xp, level }) {
  const xpNeeded = getXpForLevel(level);
  const progress = Math.min(xp / xpNeeded, 1);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>EXP</Text>
        <Text style={styles.xpText}>
          {xp} / {xpNeeded}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[styles.barFill, { width: widthInterpolated }]}
        />
        <View style={styles.barGlow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
  },
  xpText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.xpBarBackground,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.xpBar,
    borderRadius: BORDER_RADIUS.round,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  barGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.round,
  },
});
