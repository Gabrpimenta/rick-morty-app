import { db } from '../../src/database/sqlite';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorites,
} from '../../src/database/repositories/FavoriteRepository';
import type { Character } from '@/types/api';
import type { ItemType } from '@/types/common';

const mockDbRunAsync = db.runAsync as jest.Mock;
const mockDbGetFirstAsync = db.getFirstAsync as jest.Mock;
const mockDbGetAllAsync = db.getAllAsync as jest.Mock;

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

const mockCharacter: Character = {
  id: 1,
  name: 'Rick',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '...url...' },
  location: { name: 'Citadel of Ricks', url: '...url...' },
  image: '...url...',
  episode: ['...url...'],
  url: '...url...',
  created: '...',
};
const characterItemType: ItemType = 'character';

describe('FavoriteRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('addFavorite', () => {
    it('should call db.runAsync with correct SQL and parameters', async () => {
      const expectedSql = `INSERT OR IGNORE INTO favorites (itemId, itemType, data) VALUES (?, ?, ?);`;
      const expectedParams = [mockCharacter.id, characterItemType, JSON.stringify(mockCharacter)];

      await addFavorite(characterItemType, mockCharacter);

      expect(mockDbRunAsync).toHaveBeenCalledTimes(1);
      expect(mockDbRunAsync).toHaveBeenCalledWith(expectedSql, expectedParams);
    });

    it('should return the result from db.runAsync', async () => {
      const mockRunResult = { changes: 1, lastInsertRowId: 123 };
      mockDbRunAsync.mockResolvedValueOnce(mockRunResult);

      const result = await addFavorite(characterItemType, mockCharacter);
      expect(result).toEqual(mockRunResult);
    });

    it('should throw error if db.runAsync fails', async () => {
      const mockError = new Error('DB Insert Error');
      mockDbRunAsync.mockRejectedValueOnce(mockError);

      await expect(addFavorite(characterItemType, mockCharacter)).rejects.toThrow(
        'DB Insert Error'
      );
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('should call db.runAsync with correct SQL and parameters', async () => {
      const itemId = mockCharacter.id;
      const expectedSql = `DELETE FROM favorites WHERE itemId = ? AND itemType = ?;`;
      const expectedParams = [itemId, characterItemType];

      await removeFavorite(characterItemType, itemId);

      expect(mockDbRunAsync).toHaveBeenCalledTimes(1);
      expect(mockDbRunAsync).toHaveBeenCalledWith(expectedSql, expectedParams);
    });
  });

  describe('isFavorite', () => {
    it('should call db.getFirstAsync with correct SQL and params', async () => {
      const itemId = mockCharacter.id;
      const expectedSql = `SELECT 1 as found FROM favorites WHERE itemId = ? AND itemType = ? LIMIT 1;`;
      const expectedParams = [itemId, characterItemType];
      mockDbGetFirstAsync.mockResolvedValueOnce(null);

      await isFavorite(characterItemType, itemId);

      expect(mockDbGetFirstAsync).toHaveBeenCalledTimes(1);
      expect(mockDbGetFirstAsync).toHaveBeenCalledWith(expectedSql, expectedParams);
    });

    it('should return true if item exists', async () => {
      mockDbGetFirstAsync.mockResolvedValueOnce({ found: 1 });
      const result = await isFavorite(characterItemType, mockCharacter.id);
      expect(result).toBe(true);
    });

    it('should return false if item does not exist', async () => {
      mockDbGetFirstAsync.mockResolvedValueOnce(null);
      const result = await isFavorite(characterItemType, 999);
      expect(result).toBe(false);
    });

    it('should throw error if db.getFirstAsync fails', async () => {
      const mockError = new Error('DB Select Error');
      mockDbGetFirstAsync.mockRejectedValueOnce(mockError);

      await expect(isFavorite(characterItemType, mockCharacter.id)).rejects.toThrow(
        'DB Select Error'
      );
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('getFavorites', () => {
    it('should call db.getAllAsync and parse results', async () => {
      const mockRow = {
        id: 5,
        itemId: mockCharacter.id,
        itemType: 'character',
        data: JSON.stringify(mockCharacter),
      };
      const expectedSql = `SELECT id, itemId, itemType, data FROM favorites ORDER BY addedAt DESC;`;
      mockDbGetAllAsync.mockResolvedValueOnce([mockRow]);

      const results = await getFavorites();

      expect(mockDbGetAllAsync).toHaveBeenCalledTimes(1);
      expect(mockDbGetAllAsync).toHaveBeenCalledWith(expectedSql, []);
      expect(results).toHaveLength(1);
      expect(results[0].dbId).toBe(5);
      expect(results[0].itemId).toBe(mockCharacter.id);
      expect(results[0].itemType).toBe('character');
      expect(results[0].item).toEqual(mockCharacter);
    });

    it('should filter by itemType if provided', async () => {
      const filterType = 'episode';
      const expectedSql = `SELECT id, itemId, itemType, data FROM favorites WHERE itemType = ? ORDER BY addedAt DESC;`;
      const expectedParams = [filterType];
      mockDbGetAllAsync.mockResolvedValueOnce([]);

      await getFavorites(filterType);

      expect(mockDbGetAllAsync).toHaveBeenCalledTimes(1);
      expect(mockDbGetAllAsync).toHaveBeenCalledWith(expectedSql, expectedParams);
    });
  });
});
