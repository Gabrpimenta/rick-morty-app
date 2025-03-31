import 'react-native-gesture-handler';

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { QueryProvider } from '@/providers/QueryProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { StyledComponentsThemeProvider } from '@/providers/StyledComponentsThemeProvider';

import { AppNavigator } from '@/navigation/AppNavigator';

import { FONT_FAMILY_REGULAR, FONT_FAMILY_BOLD } from '@/config/theme';
import { RootState } from '@/store/rootReducer';
import { initDatabase } from '@/database/sqlite'; // <-- Import initDatabase

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    [FONT_FAMILY_REGULAR]: require('@/assets/fonts/Exo2-Regular.ttf'),
    [FONT_FAMILY_BOLD]: require('@/assets/fonts/Exo2-Bold.ttf'),
  });

  useEffect(() => {
    initDatabase()
      .then(() => console.log('Database initialization check complete.'))
      .catch((err) => console.error('Database initialization failed:', err));
  }, []);

  const AppContent = () => {
    const themeMode = useSelector((state: RootState) => state.theme.mode);

    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
        if (fontError) {
          console.warn('Error loading fonts:', fontError);
        }
      }
    }, []);

    if (!fontsLoaded && !fontError) {
      return null;
    }

    return (
      <View style={styles.flexContainer} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
      </View>
    );
  };
  return (
    <GestureHandlerRootView style={styles.flexContainer}>
      <SafeAreaProvider>
        <ReduxProvider>
          <QueryProvider>
            <StyledComponentsThemeProvider>
              <AppContent />
            </StyledComponentsThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});
