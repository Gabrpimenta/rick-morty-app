import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Custom hook to subscribe to AppState changes.
 * @param onChange Callback function to execute when AppState changes.
 */
export function useAppState(onChange: (status: AppStateStatus) => void) {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current !== nextAppState) {
        onChange(nextAppState);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onChange]);
}
