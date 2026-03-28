import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { QUEST_DIFFICULTIES } from '../constants/gameConfig';

export default function AddQuestModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('NORMAL');

  const handleAdd = () => {
    if (!title.trim()) return;
    const quest = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim(),
      difficulty,
      xpReward: QUEST_DIFFICULTIES[difficulty].xp,
      completed: false,
      createdAt: Date.now(),
    };
    onAdd(quest);
    setTitle('');
    setDescription('');
    setDifficulty('NORMAL');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>[ NEW QUEST ]</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>QUEST NAME</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter quest name..."
            placeholderTextColor={COLORS.textMuted}
            maxLength={60}
          />

          <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the quest..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            maxLength={200}
          />

          <Text style={styles.label}>DIFFICULTY / RANK</Text>
          <View style={styles.difficultyRow}>
            {Object.entries(QUEST_DIFFICULTIES).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.difficultyBtn,
                  { borderColor: val.color },
                  difficulty === key && { backgroundColor: val.color + '33' },
                ]}
                onPress={() => setDifficulty(key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.difficultyText, { color: val.color }]}>{val.label}</Text>
                <Text style={[styles.difficultyXp, { color: val.color }]}>+{val.xp} XP</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!title.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>CREATE QUEST</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 3,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  difficultyBtn: {
    flex: 1,
    minWidth: '40%',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  difficultyXp: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  addBtnText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.black,
    letterSpacing: 3,
  },
});
