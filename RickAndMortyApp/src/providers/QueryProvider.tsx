import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Platform, type AppStateStatus } from 'react-native'; // Import Platform
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: Platform.OS === 'web',
            refetchInterval: 60 * 1000,
          },
        },
      })
  );

  useOnlineManager();

  useAppState(onAppStateChange);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
