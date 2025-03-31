import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loadTheme, saveTheme } from '@/database/repositories/PreferencesRepository';
import type { RootState } from '../rootReducer';
import type { AppDispatch } from '../index';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ThemeState = {
  mode: 'dark',
  status: 'idle',
  error: null,
};

/**
 * Async thunk to load the saved theme preference from the database when the app starts.
 * Dispatches actions based on promise state (pending, fulfilled, rejected).
 * Returns the loaded theme mode or the default if none is found.
 */
export const loadInitialTheme = createAsyncThunk<ThemeMode, void, { state: RootState }>(
  'theme/loadInitial',
  async (_, thunkAPI) => {
    try {
      console.log('[themeSlice] Attempting to load theme from DB...');
      const savedTheme = await loadTheme();
      const initialTheme = savedTheme ?? initialState.mode;
      console.log(`[themeSlice] Loaded theme: ${initialTheme}`);
      return initialTheme;
    } catch (error: any) {
      console.error('[themeSlice] Failed to load theme:', error);
      return thunkAPI.rejectWithValue(error?.message ?? 'Failed to load theme preference');
    }
  }
);

/**
 * Async thunk to update the theme in Redux state immediately (optimistic update)
 * AND persist the new theme choice to the database asynchronously.
 * Takes the new ThemeMode as an argument.
 */
export const setAndPersistTheme = createAsyncThunk<
  ThemeMode,
  ThemeMode,
  { dispatch: AppDispatch; state: RootState }
>('theme/setAndPersist', async (newMode, { dispatch }) => {
  dispatch(setThemeState(newMode));
  console.log(`[themeSlice] Optimistically set theme state: ${newMode}`);

  try {
    console.log(`[themeSlice] Attempting to save theme to DB: ${newMode}`);
    await saveTheme(newMode);
    console.log(`[themeSlice] Successfully saved theme: ${newMode}`);
    return newMode;
  } catch (error: any) {
    console.error(`[themeSlice] Failed to save theme ${newMode}:`, error);
    throw error;
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeState(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInitialTheme.pending, (state) => {
        console.log('[themeSlice] loadInitialTheme pending...');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadInitialTheme.fulfilled, (state, action: PayloadAction<ThemeMode>) => {
        console.log('[themeSlice] loadInitialTheme fulfilled:', action.payload);
        state.status = 'succeeded';
        state.mode = action.payload;
        state.error = null;
      })
      .addCase(loadInitialTheme.rejected, (state, action) => {
        console.log('[themeSlice] loadInitialTheme rejected:', action.payload);
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Unknown error loading theme';
      })
      .addCase(setAndPersistTheme.rejected, (state, action) => {
        console.error('[themeSlice] setAndPersistTheme rejected:', action.payload);
        state.status = 'failed';
        state.error = 'Failed to save theme preference.';
      });
  },
});

export const { setThemeState } = themeSlice.actions;
export default themeSlice.reducer;
