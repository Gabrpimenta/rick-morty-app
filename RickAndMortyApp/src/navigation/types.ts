import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  CharacterList: undefined;
  EpisodeList: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type CharacterListScreenProps = BottomTabScreenProps<TabParamList, 'CharacterList'>;
export type EpisodeListScreenProps = BottomTabScreenProps<TabParamList, 'EpisodeList'>;
export type FavoritesScreenProps = BottomTabScreenProps<TabParamList, 'Favorites'>;
export type SettingsScreenProps = BottomTabScreenProps<TabParamList, 'Settings'>;
