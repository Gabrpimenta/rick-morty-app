import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { CharacterListScreen } from '@/features/characters/screens/CharacterListScreen';
import { EpisodeListScreen } from '@/features/episodes/screens/EpisodeListScreen';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';

import { AppHeader } from '@/components/layout/AppHeader';

import type { TabParamList } from './types';
import { useTheme } from 'styled-components';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function AppNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        header: (props) => <AppHeader />,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle-outline';
          if (route.name === 'CharacterList') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'EpisodeList') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
      })}
    >
      <Tab.Screen name="CharacterList" component={CharacterListScreen} />
      <Tab.Screen name="EpisodeList" component={EpisodeListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
