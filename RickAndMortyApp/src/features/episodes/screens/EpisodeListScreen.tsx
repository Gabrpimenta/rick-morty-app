import React, { useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  useWindowDimensions,
} from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useEpisodeList } from '../hooks/useEpisodeList';
import type { Episode } from '@/types/api';
import styled, { useTheme } from 'styled-components/native';
import { EpisodeCard } from '@/components/InteractiveCard/EpisodeCard';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { CenteredContainer } from '@/components/common/CenteredContainer';
import { InfoText } from '@/components/common/InfoText';
import { styles } from './styles';
import { EPISODE_CARD_HEIGHT, LIST_PADDING } from '@/constants/layout';

export function EpisodeListScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - LIST_PADDING * 2;

  // TODO: Add state for filters later
  const filters = {};

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    isError,
    refetch,
  } = useEpisodeList(filters);

  const episodes = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderEpisodeCard = ({ item }: ListRenderItemInfo<Episode>) => {
    return (
      <View style={{ marginBottom: LIST_PADDING }}>
        <EpisodeCard item={item} width={cardWidth} height={EPISODE_CARD_HEIGHT} />
      </View>
    );
  };
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError && !episodes.length) {
    return <ErrorDisplay message={error?.message || 'Failed to load data'} onRetry={refetch} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlashList
        data={episodes}
        renderItem={renderEpisodeCard}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.7}
        estimatedItemSize={EPISODE_CARD_HEIGHT + LIST_PADDING}
        contentContainerStyle={{ paddingHorizontal: LIST_PADDING, paddingTop: LIST_PADDING }}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 20 }} color={theme.colors.primary} />
          ) : null
        }
        onRefresh={refetch}
        refreshing={isFetching && !isFetchingNextPage && !isLoading}
        ListEmptyComponent={() =>
          !isFetching ? (
            <CenteredContainer>
              <InfoText>No episodes found.</InfoText>
            </CenteredContainer>
          ) : null
        }
      />
    </View>
  );
}
