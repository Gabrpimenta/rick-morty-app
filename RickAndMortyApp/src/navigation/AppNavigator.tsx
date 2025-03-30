import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CharacterListScreen from '@/features/characters/screens/CharacterListScreen';
import EpisodeListScreen from '@/features/episodes/screens/EpisodeListScreen';
import FavoritesScreen from '@/features/favorites/screens/FavoritesScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="CharacterList"
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: true,
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
      })}
    >
      <Tab.Screen
        name="CharacterList"
        component={CharacterListScreen}
        options={{ title: 'Characters' }}
      />
      <Tab.Screen
        name="EpisodeList"
        component={EpisodeListScreen}
        options={{ title: 'Episodes' }}
      />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
