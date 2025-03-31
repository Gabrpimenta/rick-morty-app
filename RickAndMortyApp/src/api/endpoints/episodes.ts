import { API_PATHS } from '@/constants/api';
import apiClient from './rickAndMortyAPI';
import type { EpisodesApiResponse, EpisodeFilters, Episode } from '@/types/api';

export const getEpisodes = async (filters: EpisodeFilters = {}): Promise<EpisodesApiResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.name) params.append('name', filters.name);
    if (filters.episode) params.append('episode', filters.episode);

    const response = await apiClient.get<EpisodesApiResponse>(API_PATHS.EPISODE, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
};

export const getEpisodeById = async (id: number): Promise<Episode> => {
  try {
    const response = await apiClient.get<Episode>(`${API_PATHS.EPISODE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching episode ${id}:`, error);
    throw error;
  }
};

export const getMultipleEpisodes = async (ids: number[]): Promise<Episode[]> => {
  if (ids.length === 0) return [];
  try {
    const response = await apiClient.get<Episode[] | Episode>(
      `${API_PATHS.EPISODE}/${ids.join(',')}`
    );

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data) {
      return [response.data];
    } else {
      console.warn(`No episodes found for IDs: ${ids.join(',')}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching multiple episodes [${ids.join(',')}]:`, error);
    throw error;
  }
};
