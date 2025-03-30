import apiClient from './rickAndMortyAPI';
import type { CharactersApiResponse, CharacterFilters, Character } from '@/types/api';

export const getCharacters = async (
  filters: CharacterFilters = {}
): Promise<CharactersApiResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.species) params.append('species', filters.species);
    if (filters.type) params.append('type', filters.type);
    if (filters.gender) params.append('gender', filters.gender);

    const response = await apiClient.get<CharactersApiResponse>(`/character`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

export const getCharacterById = async (id: number): Promise<Character> => {
  try {
    const response = await apiClient.get<Character>(`/character/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
};

export const getMultipleCharacters = async (ids: number[]): Promise<Character[]> => {
  if (ids.length === 0) return [];
  try {
    const response = await apiClient.get<Character[]>(`/character/${ids.join(',')}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error(`Error fetching multiple characters [${ids.join(',')}]:`, error);
    throw error;
  }
};
