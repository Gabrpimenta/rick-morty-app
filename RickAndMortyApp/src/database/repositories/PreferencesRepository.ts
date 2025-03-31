// src/database/repositories/PreferencesRepository.ts
import { db } from '../sqlite';
import type { ThemeMode } from '@/store/slices/themeSlice';

const THEME_KEY = 'themePreference';

/**
 * Saves the selected theme mode to the database.
 * Uses INSERT OR REPLACE to either insert or update the value for the theme key.
 */
export const saveTheme = async (theme: ThemeMode): Promise<void> => {
  const sql = `INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);`;
  try {
    await db.runAsync(sql, [THEME_KEY, theme]);
    console.log(`Theme preference saved: ${theme}`);
  } catch (error) {
    console.error(`Error saving theme preference:`, error);
    throw error;
  }
};

/**
 * Loads the saved theme mode from the database.
 * @returns The saved theme mode ('light' or 'dark') or null if not found.
 */
export const loadTheme = async (): Promise<ThemeMode | null> => {
  const sql = `SELECT value FROM preferences WHERE key = ?;`;
  try {
    const result = await db.getFirstAsync<{ value: string }>(sql, [THEME_KEY]);

    if (result && (result.value === 'light' || result.value === 'dark')) {
      console.log(`Theme preference loaded: ${result.value}`);
      return result.value as ThemeMode;
    }
    console.log('No saved theme preference found.');
    return null;
  } catch (error) {
    console.error(`Error loading theme preference:`, error);
    throw error;
  }
};
