# Solo Leveling Fitness App

A fitness and habit-building app inspired by the Solo Leveling manhwa. Level up your real life just like Sung Jin-Woo - complete daily quests, earn XP, and rise through hunter ranks.

## Features

- **Quest System** - Create, view, complete, and delete custom quests
- **XP & Level System** - Earn XP for completing quests, fill your XP bar, and level up
- **Hunter Ranks** - Progress through E -> D -> C -> B -> A -> S class ranks
- **Level-Up Popup** - Solo Leveling-inspired system notification when you level up
- **Dark Theme** - Immersive dark blue/black UI inspired by the Solo Leveling aesthetic
- **Persistent Storage** - Your progress is saved locally on your device

## Tech Stack

- **React Native** with **Expo** (cross-platform iOS & Android)
- **React Navigation** (Bottom Tabs)
- **React Native Reanimated** (animations)
- **AsyncStorage** (local persistence)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (https://docs.expo.dev/get-started/installation/)
- Expo Go app on your phone (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Then scan the QR code with the Expo Go app on your phone.

### Running on simulator

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android
```

## Project Structure

```
SoloLevelingFitnessApp/
├── App.js                    # App entry point with navigation
├── app.json                  # Expo configuration
├── package.json
├── babel.config.js
└── src/
    ├── constants/
    │   ├── theme.js          # Colors, fonts, spacing
    │   └── gameConfig.js     # XP formulas, ranks, difficulty
    ├── context/
    │   └── GameContext.js    # Global state (quests, XP, level)
    ├── components/
    │   ├── XPBar.js          # Animated XP progress bar
    │   ├── QuestItem.js      # Individual quest card
    │   ├── AddQuestModal.js  # Modal for creating new quests
    │   └── LevelUpModal.js   # Solo Leveling level-up popup
    └── screens/
        ├── HomeScreen.js     # Status window: level, XP, stats
        └── QuestScreen.js    # Quest board: list, add, complete
```

## Quest Difficulties

| Rank   | XP Reward | Description            |
|--------|-----------|------------------------|
| E-Rank | 20 XP     | Easy daily habits      |
| D-Rank | 50 XP     | Regular workout quests |
| C-Rank | 100 XP    | Challenging exercises  |
| S-Rank | 250 XP    | Legendary challenges   |

## Hunter Ranks

| Rank    | Levels | Color  |
|---------|--------|--------|
| E-Class | 1-9    | Gray   |
| D-Class | 10-19  | Cyan   |
| C-Class | 20-29  | Green  |
| B-Class | 30-39  | Purple |
| A-Class | 40-49  | Orange |
| S-Class | 50+    | Gold   |

## Future Features

- Leaderboard / social competition
- Fitness tracker integration (Apple Health, Google Fit)
- Push notifications for daily quests
- Quest templates / categories
- Achievement system
