import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  Platform,
  type ListRenderItemInfo,
} from 'react-native';
import { useEpisodeList } from '../hooks/useEpisodeList';
import { useDebounce } from '@/hooks/useDebounce';
import { usePager } from '@/hooks/usePager';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { InfoText } from '@/components/common/InfoText';
import { CenteredContainer } from '@/components/common/CenteredContainer';
import { EpisodeCard } from '@/components/InteractiveCard/EpisodeCard';
import type { Episode, EpisodeFilters } from '@/types/api';
import { useTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as layout from '@/constants/layout';
import {
  ArrowButton,
  ArrowContainer,
  CardOuterContainer,
  FilterInput,
  FilterInputContainer,
  ScreenContainer,
  styles,
} from './styles';

export function EpisodeListScreen() {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [nameFilter, setNameFilter] = useState('');
  const [episodeCodeFilter, setEpisodeCodeFilter] = useState('');
  const debouncedNameFilter = useDebounce(nameFilter, 500);
  const debouncedEpisodeCodeFilter = useDebounce(episodeCodeFilter, 500);

  const cardWidth = screenWidth - layout.PAGER_HORIZONTAL_PADDING * 2;
  const approxHeaderHeight = Platform.OS === 'ios' ? 90 : 60;
  const approxTabBarHeight = Platform.OS === 'ios' ? 80 : 60;
  const filterInputsHeight = (40 + theme.spacing.small) * 2 + layout.SCREEN_PADDING;
  const cardHeight =
    screenHeight -
    layout.PAGER_VERTICAL_MARGIN * 2 -
    approxHeaderHeight -
    approxTabBarHeight -
    filterInputsHeight -
    theme.spacing.small;

  const filters = useMemo((): EpisodeFilters => {
    const activeFilters: EpisodeFilters = {};
    if (debouncedNameFilter.trim()) {
      activeFilters.name = debouncedNameFilter.trim();
    }
    if (debouncedEpisodeCodeFilter.trim()) {
      activeFilters.episode = debouncedEpisodeCodeFilter.trim();
    }
    return activeFilters;
  }, [debouncedNameFilter, debouncedEpisodeCodeFilter]);

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

  const episodes = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  const {
    pagerRef,
    currentIndex,
    handlePrevious,
    handleNext,
    scrollToStart,
    onViewableItemsChanged,
    viewabilityConfig,
  } = usePager<Episode>(episodes.length);

  const prevFiltersRef = useRef(JSON.stringify(filters));
  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);
    if (prevFiltersRef.current !== currentFiltersString) {
      scrollToStart();
      prevFiltersRef.current = currentFiltersString;
    }
  }, [filters, scrollToStart]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (currentIndex >= episodes.length - 3 && hasNextPage && !isFetchingNextPage) {
      loadNextPage();
    }
  }, [currentIndex, episodes.length, hasNextPage, isFetchingNextPage, loadNextPage]);

  const renderEpisodeCard = useCallback(
    ({ item }: ListRenderItemInfo<Episode>) => {
      return (
        <CardOuterContainer screenWidth={screenWidth}>
          <EpisodeCard item={item} width={cardWidth} height={cardHeight} />
        </CardOuterContainer>
      );
    },
    [screenWidth, cardWidth, cardHeight]
  );

  const hasActiveFilters = !!nameFilter || !!episodeCodeFilter;
  const showInitialLoading = isLoading && !hasActiveFilters;

  if (showInitialLoading) return <LoadingIndicator />;
  if (isError && !episodes.length)
    return <ErrorDisplay message={error?.message} onRetry={refetch} />;

  return (
    <ScreenContainer>
      <FilterInputContainer>
        <FilterInput
          placeholder="Search by Episode Name..."
          value={nameFilter}
          onChangeText={setNameFilter}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <FilterInput
          placeholder="Filter by Code (e.g., S01E01)"
          value={episodeCodeFilter}
          onChangeText={setEpisodeCodeFilter}
          autoCapitalize="characters"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {isFetching && !isLoading && !isFetchingNextPage && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.fetchingIndicator}
          />
        )}
      </FilterInputContainer>

      <FlatList
        ref={pagerRef}
        data={episodes}
        renderItem={renderEpisodeCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={1}
        getItemLayout={(_data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View style={[styles.footerContainer, { width: screenWidth / 2, height: cardHeight }]}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !isFetching && !isLoading ? (
            <CenteredContainer style={{ width: cardWidth }}>
              <InfoText>
                {hasActiveFilters
                  ? `No episodes found matching current criteria.`
                  : 'No episodes found.'}
              </InfoText>
            </CenteredContainer>
          ) : null
        }
      />

      <ArrowContainer>
        <ArrowButton onPress={handlePrevious} disabled={currentIndex <= 0}>
          <Ionicons
            name="arrow-back-circle"
            size={40}
            color={currentIndex <= 0 ? theme.colors.textDisabled : theme.colors.primary}
          />
        </ArrowButton>
        <ArrowButton
          onPress={handleNext}
          disabled={currentIndex >= episodes.length - 1 && !hasNextPage}
        >
          <Ionicons
            name="arrow-forward-circle"
            size={40}
            color={
              currentIndex >= episodes.length - 1 && !hasNextPage
                ? theme.colors.textDisabled
                : theme.colors.primary
            }
          />
        </ArrowButton>
      </ArrowContainer>
    </ScreenContainer>
  );
}
