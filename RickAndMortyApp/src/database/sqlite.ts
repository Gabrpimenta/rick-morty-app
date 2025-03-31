import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

function openDb(): SQLite.SQLiteDatabase {
  if (Platform.OS === 'web') {
    console.warn('expo-sqlite is not fully supported on web.');
    return {} as unknown as SQLite.SQLiteDatabase;
  }
  const db = SQLite.openDatabaseSync('rickmorty_favorites.db');
  console.log('Database opened successfully (sync).');
  return db;
}
export const db = openDb();

export const initDatabase = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('Skipping database initialization on web.');
    return;
  }
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
    console.log('Journal mode set to WAL.');

    await db.withTransactionAsync(async () => {
      console.log('Initializing favorites table structure...');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          itemId INTEGER NOT NULL,
          itemType TEXT NOT NULL CHECK(itemType IN ('character', 'episode')),
          data TEXT NOT NULL,
          addedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_favorites_item ON favorites(itemId, itemType);

        CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON favorites(itemId, itemType);
      `);

      console.log('Favorites table structure initialized successfully.');
    });

    console.log('Database initialization transaction committed successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};
