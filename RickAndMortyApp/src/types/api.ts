export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersApiResponse {
  info: ApiInfo;
  results: Character[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodesApiResponse {
  info: ApiInfo;
  results: Episode[];
}

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: 'Alive' | 'Dead' | 'unknown';
  species?: string;
  type?: string;
  gender?: 'Female' | 'Male' | 'Genderless' | 'unknown';
}

export interface EpisodeFilters {
  page?: number;
  name?: string;
  episode?: string;
}
