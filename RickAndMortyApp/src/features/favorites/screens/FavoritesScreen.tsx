import React, { useCallback, useMemo } from 'react';
import { View, SectionList, useWindowDimensions, type ListRenderItemInfo } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';

import { getFavorites, type SavedFavorite } from '@/database/repositories/FavoriteRepository';

import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { InfoText } from '@/components/common/InfoText';
import { CenteredContainer } from '@/components/common/CenteredContainer';

import { CharacterCard } from '@/components/InteractiveCard/CharacterCard';
import { EpisodeCard } from '@/components/InteractiveCard/EpisodeCard';
import type { Character, Episode } from '@/types/api';
import { styles } from './styles';

// --- Constants ---
const LIST_PADDING = 16;
const CHARACTER_CARD_HEIGHT = 320;
const EPISODE_CARD_HEIGHT = 120;

const SectionHeaderText = styled.Text`
  font-size: ${(props) => props.theme.typography.fontSizeH2}px;
  font-family: ${(props) => props.theme.typography.fontFamilyBold};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.small}px;
  margin-top: ${(props) => props.theme.spacing.large}px;
`;

export function FavoritesScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - LIST_PADDING * 2;

  const {
    data: favorites,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SavedFavorite[], Error>({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const favoriteSections = useMemo(() => {
    if (!favorites) return [];

    const characters = favorites.filter((fav) => fav.itemType === 'character');
    const episodes = favorites.filter((fav) => fav.itemType === 'episode');

    const sections = [];
    if (characters.length > 0) {
      sections.push({ title: 'Favorite Characters', data: characters });
    }
    if (episodes.length > 0) {
      sections.push({ title: 'Favorite Episodes', data: episodes });
    }
    return sections;
  }, [favorites]);

  const renderFavoriteItem = ({ item }: ListRenderItemInfo<SavedFavorite>) => {
    return (
      <View style={{ marginBottom: LIST_PADDING }}>
        {item.itemType === 'character' ? (
          <CharacterCard
            item={item.item as Character}
            width={cardWidth}
            height={CHARACTER_CARD_HEIGHT}
          />
        ) : (
          <EpisodeCard item={item.item as Episode} width={cardWidth} height={EPISODE_CARD_HEIGHT} />
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <SectionHeaderText>{title}</SectionHeaderText>
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <CenteredContainer>
        <ErrorDisplay message={error?.message || 'Failed to load favorites'} onRetry={refetch} />
      </CenteredContainer>
    );
  }

  if (!favoriteSections || favoriteSections.length === 0) {
    return (
      <CenteredContainer>
        <InfoText>You haven't added any favorites yet!</InfoText>
      </CenteredContainer>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SectionList
        sections={favoriteSections}
        renderItem={renderFavoriteItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => `${item.itemType}-${item.itemId}-${index}`}
        contentContainerStyle={styles.listContentContainer}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
