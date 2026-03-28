import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import QuestScreen from './src/screens/QuestScreen';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    border: COLORS.border,
    text: COLORS.textPrimary,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <GameProvider>
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                const icons = {
                  Home: focused ? 'home' : 'home-outline',
                  Quests: focused ? 'flash' : 'flash-outline',
                };
                return <Ionicons name={icons[route.name]} size={size} color={color} />;
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: COLORS.textMuted,
              tabBarStyle: {
                backgroundColor: COLORS.surface,
                borderTopColor: COLORS.border,
                borderTopWidth: 1,
                height: 60,
                paddingBottom: SPACING.sm,
                paddingTop: SPACING.xs,
              },
              tabBarLabelStyle: {
                fontSize: FONTS.sizes.xs,
                fontWeight: FONTS.weights.bold,
                letterSpacing: 1,
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Quests" component={QuestScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </GameProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
