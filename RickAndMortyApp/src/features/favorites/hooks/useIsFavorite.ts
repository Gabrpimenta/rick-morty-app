import { useQuery, QueryKey } from '@tanstack/react-query';
import { isFavorite as isFavoriteDb } from '@/database/repositories/FavoriteRepository';
import { ItemType } from '@/types/common';
import { queryKeys } from '@/constants/queryKeys';

/**
 * React Query hook to check if an item is favorited in the database.
 * @param itemType 'character' or 'episode'
 * @param itemId The ID of the item from the API
 * @returns Query result containing boolean indicating favorite status.
 */
export const useIsFavorite = (itemType: ItemType | undefined, itemId: number | undefined) => {
  const queryKey: QueryKey = [queryKeys.isFavorite, itemType, itemId];

  return useQuery<boolean, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!itemType || typeof itemId !== 'number') {
        return false;
      }
      return await isFavoriteDb(itemType, itemId);
    },
    enabled: !!itemType && typeof itemId === 'number',
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });
};
