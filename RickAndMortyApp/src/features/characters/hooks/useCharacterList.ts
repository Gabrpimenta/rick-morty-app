import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';
import { getCharacters } from '@/api/endpoints/characters';
import type { CharacterFilters, CharactersApiResponse } from '@/types/api';

export const useCharacterList = (filters: CharacterFilters = {}) => {
  return useInfiniteListQuery<CharactersApiResponse, Error, CharacterFilters>({
    queryKeyBase: 'characters',
    filters: filters,
    fetchFn: getCharacters,
  });
};
