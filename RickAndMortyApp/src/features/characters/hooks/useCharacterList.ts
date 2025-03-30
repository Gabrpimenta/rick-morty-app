import { useInfiniteQuery } from '@tanstack/react-query';
import { getCharacters } from '@/api/endpoints/characters';
import type { CharacterFilters, CharactersApiResponse } from '@/types/api';

const getPageParam = (urlString: string | null): number | undefined => {
  if (!urlString) return undefined;
  try {
    const url = new URL(urlString);
    const page = url.searchParams.get('page');
    return page ? parseInt(page, 10) : undefined;
  } catch (error) {
    console.error('Error parsing page parameter:', error);
    return undefined;
  }
};

export const useCharacterList = (filters: CharacterFilters = {}) => {
  const queryKey = ['characters', filters];

  const queryFn = async ({ pageParam = 1 }: { pageParam?: unknown }) => {
    const data = await getCharacters({ ...filters, page: pageParam as number });
    return data;
  };

  const getNextPageParam = (lastPage: CharactersApiResponse) => {
    return getPageParam(lastPage.info.next);
  };

  return useInfiniteQuery<CharactersApiResponse, Error>({
    queryKey: queryKey,
    queryFn: queryFn,
    getNextPageParam: getNextPageParam,
    initialPageParam: 1,
  });
};
