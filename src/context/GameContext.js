import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getXpForLevel } from '../constants/gameConfig';

const GameContext = createContext(null);

const STORAGE_KEY = '@solo_leveling_state';

const initialState = {
  level: 1,
  xp: 0,
  totalXp: 0,
  quests: [],
  completedQuestsCount: 0,
  showLevelUp: false,
  levelUpData: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, showLevelUp: false };

    case 'ADD_QUEST':
      return {
        ...state,
        quests: [action.payload, ...state.quests],
      };

    case 'DELETE_QUEST':
      return {
        ...state,
        quests: state.quests.filter((q) => q.id !== action.payload),
      };

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find((q) => q.id === action.payload);
      if (!quest || quest.completed) return state;

      const newXp = state.xp + quest.xpReward;
      let level = state.level;
      let remainingXp = newXp;
      let didLevelUp = false;
      let newLevel = level;

      while (remainingXp >= getXpForLevel(level)) {
        remainingXp -= getXpForLevel(level);
        level += 1;
        didLevelUp = true;
        newLevel = level;
      }

      return {
        ...state,
        xp: remainingXp,
        level,
        totalXp: state.totalXp + quest.xpReward,
        completedQuestsCount: state.completedQuestsCount + 1,
        quests: state.quests.map((q) =>
          q.id === action.payload ? { ...q, completed: true, completedAt: Date.now() } : q
        ),
        showLevelUp: didLevelUp,
        levelUpData: didLevelUp ? { newLevel, xpGained: quest.xpReward } : state.levelUpData,
      };
    }

    case 'DISMISS_LEVEL_UP':
      return { ...state, showLevelUp: false };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  async function loadState() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }

  async function saveState(s) {
    try {
      const { showLevelUp, levelUpData, ...toSave } = s;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  const addQuest = (quest) => dispatch({ type: 'ADD_QUEST', payload: quest });
  const deleteQuest = (id) => dispatch({ type: 'DELETE_QUEST', payload: id });
  const completeQuest = (id) => dispatch({ type: 'COMPLETE_QUEST', payload: id });
  const dismissLevelUp = () => dispatch({ type: 'DISMISS_LEVEL_UP' });

  return (
    <GameContext.Provider value={{ state, addQuest, deleteQuest, completeQuest, dismissLevelUp }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
