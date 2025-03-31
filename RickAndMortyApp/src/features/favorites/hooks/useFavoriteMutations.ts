import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { addFavorite, removeFavorite } from '@/database/repositories/FavoriteRepository';
import { FavoriteItem, ItemType } from '@/types/common';
import { queryKeys } from '@/constants/queryKeys';

/**
 * React Query mutation hook for adding an item to favorites.
 */
export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { itemType: ItemType; item: FavoriteItem }>({
    mutationFn: ({ itemType, item }) => addFavorite(itemType, item),
    onSuccess: (data, variables) => {
      console.log('Successfully added favorite, invalidating queries...');
      queryClient.invalidateQueries({
        queryKey: [queryKeys.isFavorite, variables.itemType, variables.item.id],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.favorites] });
    },
    onError: (error) => {
      console.error('Error adding favorite via mutation:', error);
    },
  });
};

/**
 * React Query mutation hook for removing an item from favorites.
 */
export const useRemoveFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { itemType: ItemType; itemId: number }>({
    mutationFn: ({ itemType, itemId }) => removeFavorite(itemType, itemId),
    onSuccess: (data, variables) => {
      console.log('Successfully removed favorite, invalidating queries...');
      queryClient.invalidateQueries({
        queryKey: [queryKeys.isFavorite, variables.itemType, variables.item.id],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.favorites] });
    },
    onError: (error) => {
      console.error('Error removing favorite via mutation:', error);
    },
  });
};
