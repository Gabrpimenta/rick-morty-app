import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

/**
 * Opens or creates the SQLite database file.
 * Uses openDatabaseSync for newer expo-sqlite versions (Expo SDK 51+).
 * Provides a basic stub for web where expo-sqlite is limited.
 * @returns {SQLite.SQLiteDatabase} The database object.
 */
function openDb(): SQLite.SQLiteDatabase {
  if (Platform.OS === 'web') {
    console.warn('expo-sqlite is not fully supported on web.');
    return {
      transactionAsync: async (callback, readOnly) => {
        await callback();
        console.warn(`DB Transaction ignored on web (readOnly: ${readOnly})`);
      },
      readTransactionAsync: async (callback) => {
        await callback();
        console.warn('DB Read Transaction ignored on web');
        return { rows: { _array: [], length: 0 }, rowsAffected: 0 };
      },
      execSync: () => {
        console.warn('DB execSync ignored on web');
      },
      runSync: () => {
        console.warn('DB runSync ignored on web');
        return { changes: 0, lastInsertRowId: 0 };
      },
      getFirstSync: () => {
        console.warn('DB getFirstSync ignored on web');
        return null;
      },
      getAllSync: () => {
        console.warn('DB getAllSync ignored on web');
        return [];
      },
      getEachSync: () => {
        console.warn('DB getEachSync ignored on web');
        return { [Symbol.iterator]: () => ({ next: () => ({ done: true, value: undefined }) }) };
      },
      prepareSync: () => {
        console.warn('DB prepareSync ignored on web');
        const mockStatement = {
          executeSync: () => {
            console.warn('DB statement executeSync ignored on web');
            return {
              changes: 0,
              lastInsertRowId: 0,
              getFirstSync: () => null,
              getAllSync: () => [],
              getEachSync: () => ({
                [Symbol.iterator]: () => ({ next: () => ({ done: true, value: undefined }) }),
              }),
              resetSync: () => {},
              closeSync: () => {},
            } as unknown as SQLite.SQLiteExecuteSyncResult<unknown>;
          },
          getColumnNamesSync: () => [],
          closeSync: () => {},
        } as unknown as SQLite.SQLiteStatement;
        return mockStatement;
      },
      closeSync: () => {
        console.warn('DB closeSync ignored on web');
      },
      isInTransactionSync: () => {
        console.warn('DB isInTransactionSync returning false on web');
        return false;
      },
      withTransactionAsync: async (callback) => {
        await callback();
        console.warn('DB withTransactionAsync ignored on web');
      },
    } as unknown as SQLite.SQLiteDatabase;
  }

  const db = SQLite.openDatabaseSync('rickmorty_favorites.db');
  console.log('[sqlite] Database opened successfully (sync).');
  return db;
}

export const db = openDb();

/**
 * Initializes the database by creating necessary tables if they don't exist.
 * Should be called once when the application starts (e.g., in App.tsx).
 */
export const initDatabase = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('[sqlite] Skipping database initialization on web.');
    return;
  }

  console.log('[sqlite] Attempting database initialization...');
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
    console.log('[sqlite] Journal mode set to WAL.');

    await db.withTransactionAsync(async () => {
      console.log('[sqlite] Initializing database tables structure...');

      await db.execAsync(`
        -- Favorites Table: Stores individual favorited items
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, -- Standard auto ID
          itemId INTEGER NOT NULL,                       -- ID from Rick & Morty API
          itemType TEXT NOT NULL CHECK(itemType IN ('character', 'episode')), -- Type identifier
          data TEXT NOT NULL,                            -- Full JSON data of the item
          addedAt TEXT DEFAULT CURRENT_TIMESTAMP         -- Timestamp when added
        );

        -- Index for faster lookups by item ID and type (e.g., isFavorite check)
        CREATE INDEX IF NOT EXISTS idx_favorites_item ON favorites(itemId, itemType);

        -- Unique constraint to prevent adding the exact same item twice
        CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON favorites(itemId, itemType);

        -- Preferences Table: Simple key-value store for settings like theme
        CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY NOT NULL, -- Setting key (e.g., 'themePreference')
          value TEXT NOT NULL            -- Setting value (e.g., 'dark')
        );
      `);

      console.log('[sqlite] Tables structure initialized successfully.');
    });

    console.log('[sqlite] Database initialization transaction committed successfully.');
  } catch (error) {
    console.error('[sqlite] Error during database initialization:', error);
    throw new Error('Failed to initialize database. Please try again later.');
  }
};
