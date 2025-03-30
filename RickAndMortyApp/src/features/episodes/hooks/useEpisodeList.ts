import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';
import { getEpisodes } from '@/api/endpoints/episodes';
import type { EpisodeFilters, EpisodesApiResponse } from '@/types/api';

export const useEpisodeList = (filters: EpisodeFilters = {}) => {
  return useInfiniteListQuery<EpisodesApiResponse, Error, EpisodeFilters>({
    queryKeyBase: 'episodes',
    filters: filters,
    fetchFn: getEpisodes,
  });
};
