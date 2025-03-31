import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { lightTheme } from '@/config/theme';
import { store } from '@/store';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeToUse = lightTheme;

  return (
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } }}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={testQueryClient}>
          <ThemeProvider theme={themeToUse}>
            <NavigationContainer>{children}</NavigationContainer>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
