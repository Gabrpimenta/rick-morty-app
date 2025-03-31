import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { CenteredContainer } from './CenteredContainer';

export function LoadingIndicator () {
  const theme = useTheme();

  return (
    <CenteredContainer>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </CenteredContainer>
  );
}
