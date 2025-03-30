import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { lightTheme, darkTheme } from '@/config/theme';

interface StyledComponentsThemeProviderProps {
  children: ReactNode;
}

export function StyledComponentsThemeProvider({ children }: StyledComponentsThemeProviderProps) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
