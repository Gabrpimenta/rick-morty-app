import { db } from '../sqlite';
import type { Character, Episode } from '@/types/api';
import * as SQLite from 'expo-sqlite';

type ItemType = 'character' | 'episode';
type FavoriteItem = Character | Episode;

export type SavedFavorite = {
  dbId: number;
  itemId: number;
  itemType: ItemType;
  item: FavoriteItem;
};

interface FavoriteRow {
  id: number;
  itemId: number;
  itemType: string;
  data: string;
}

/**
 * Adds a character or episode to favorites using db.runAsync.
 * Ignores if the item is already favorited due to UNIQUE constraint.
 * @returns Promise resolving with SQLiteRunResult containing changes and lastInsertRowId.
 */
export const addFavorite = async (
  itemType: ItemType,
  item: FavoriteItem
): Promise<SQLite.SQLiteRunResult> => {
  const sql = `INSERT OR IGNORE INTO favorites (itemId, itemType, data) VALUES (?, ?, ?);`;
  const params = [item.id, itemType, JSON.stringify(item)];
  try {
    const result = await db.runAsync(sql, params);
    if (result.changes > 0) {
      console.log(`Favorite added: ${itemType} ${item.id}, Row ID: ${result.lastInsertRowId}`);
    } else {
      console.log(`Favorite already exists (or insert failed): ${itemType} ${item.id}`);
    }
    return result;
  } catch (error) {
    console.error(`Error adding favorite ${itemType} ${item.id}:`, error);
    throw error;
  }
};

/**
 * Removes a character or episode from favorites using db.runAsync.
 * @returns Promise resolving with SQLiteRunResult containing changes count.
 */
export const removeFavorite = async (
  itemType: ItemType,
  itemId: number
): Promise<SQLite.SQLiteRunResult> => {
  const sql = `DELETE FROM favorites WHERE itemId = ? AND itemType = ?;`;
  const params = [itemId, itemType];
  try {
    const result = await db.runAsync(sql, params);
    if (result.changes > 0) {
      console.log(`Favorite removed: ${itemType} ${itemId}`);
    } else {
      console.log(`Favorite not found to remove: ${itemType} ${itemId}`);
    }
    return result;
  } catch (error) {
    console.error(`Error removing favorite ${itemType} ${itemId}:`, error);
    throw error;
  }
};

/**
 * Checks if a specific item is already favorited using db.getFirstAsync.
 * @returns Promise resolving with boolean.
 */
export const isFavorite = async (itemType: ItemType, itemId: number): Promise<boolean> => {
  const sql = `SELECT 1 as found FROM favorites WHERE itemId = ? AND itemType = ? LIMIT 1;`;
  const params = [itemId, itemType];
  try {
    const result = await db.getFirstAsync<{ found: 1 }>(sql, params);
    const isFav = !!result;
    return isFav;
  } catch (error) {
    console.error(`Error checking favorite status ${itemType} ${itemId}:`, error);
    throw error;
  }
};

/**
 * Retrieves all favorited items using db.getAllAsync, optionally filtered by type.
 * @returns Promise resolving with an array of SavedFavorite objects.
 */
export const getFavorites = async (filterType?: ItemType): Promise<SavedFavorite[]> => {
  let query = `SELECT id, itemId, itemType, data FROM favorites ORDER BY addedAt DESC;`;
  const params: SQLite.SQLiteBindParams = [];

  if (filterType) {
    query = `SELECT id, itemId, itemType, data FROM favorites WHERE itemType = ? ORDER BY addedAt DESC;`;
    params.push(filterType);
  }

  try {
    const allRows = await db.getAllAsync<FavoriteRow>(query, params);

    const savedItems: SavedFavorite[] = allRows
      .map((row) => {
        try {
          const parsedItem = JSON.parse(row.data) as FavoriteItem;
          return {
            dbId: row.id,
            itemId: row.itemId,
            itemType: row.itemType as ItemType,
            item: parsedItem,
          };
        } catch (e) {
          console.error('Error parsing favorite item data:', e, row.data);
          return null;
        }
      })
      .filter((item): item is SavedFavorite => item !== null);

    console.log(`Workspaceed ${savedItems.length} favorites.`);
    return savedItems;
  } catch (error) {
    console.error(`Error getting favorites (filter: ${filterType}):`, error);
    throw error;
  }
};
