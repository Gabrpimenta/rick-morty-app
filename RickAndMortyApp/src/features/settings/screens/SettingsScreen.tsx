import React from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled, { useTheme } from 'styled-components/native';

import { RootState } from '@/store/rootReducer';
import { AppDispatch } from '@/store';
import { setAndPersistTheme, type ThemeMode } from '@/store/slices/themeSlice';

const ScreenContainer = styled.View`
  flex: 1;
  padding: ${(props) => props.theme.spacing.large}px;
  background-color: ${(props) => props.theme.colors.background};
`;

const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${(props) => props.theme.spacing.medium}px;
  padding-bottom: ${(props) => props.theme.spacing.medium}px;
`;

const SettingLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  color: ${(props) => props.theme.colors.textPrimary};
  font-family: ${(props) => props.theme.typography.fontFamilyRegular};
`;

export function SettingsScreen () {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const currentThemeMode = useSelector((state: RootState) => state.theme.mode);

  const isDarkModeEnabled = currentThemeMode === 'dark';

  const handleThemeChange = (isEnabled: boolean) => {
    const newMode: ThemeMode = isEnabled ? 'dark' : 'light';
    dispatch(setAndPersistTheme(newMode));
  };

  return (
    <ScreenContainer>
      <SettingRow>
        <SettingLabel>Dark Mode</SettingLabel>
        <Switch
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={isDarkModeEnabled ? theme.colors.accent : theme.colors.surface}
          ios_backgroundColor={theme.colors.border}
          onValueChange={handleThemeChange}
          value={isDarkModeEnabled}
        />
      </SettingRow>
    </ScreenContainer>
  );
}
