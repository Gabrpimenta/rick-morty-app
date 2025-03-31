import React from 'react';
import { Button } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { CenteredContainer } from './CenteredContainer';

const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
`;

interface ErrorDisplayProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message = 'Failed to load data', onRetry }: ErrorDisplayProps) {
  const theme = useTheme();

  return (
    <CenteredContainer>
      <ErrorText>Error: {message}</ErrorText>
      <Button title="Retry" onPress={onRetry} color={theme.colors.primary} />
    </CenteredContainer>
  );
}
