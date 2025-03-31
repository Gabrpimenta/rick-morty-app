import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  type ListRenderItemInfo,
  Platform,
} from 'react-native';
import { useCharacterList } from '../hooks/useCharacterList';
import { useDebounce } from '@/hooks/useDebounce';
import { usePager } from '@/hooks/usePager';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { InfoText } from '@/components/common/InfoText';
import { CenteredContainer } from '@/components/common/CenteredContainer';
import { CharacterCard } from '@/components/InteractiveCard/CharacterCard';
import { CharacterFilterModal } from '../components/CharacterFilterModal';
import type { Character, CharacterFilters, CharacterStatus, CharacterGender } from '@/types/api';
import { useTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as layout from '@/constants/layout';
import {
  ArrowButton,
  ArrowContainer,
  CardOuterContainer,
  FilterBadge,
  FilterBadgeText,
  FilterButton,
  ScreenContainer,
  SearchAndFilterContainer,
  SearchInput,
  styles,
} from './styles';

export function CharacterListScreen() {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [appliedStatus, setAppliedStatus] = useState<CharacterStatus | 'All'>('All');
  const [appliedGender, setAppliedGender] = useState<CharacterGender | 'All'>('All');
  const [appliedSpecies, setAppliedSpecies] = useState('');
  const [appliedType, setAppliedType] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const cardWidth = screenWidth - layout.PAGER_HORIZONTAL_PADDING * 2;
  const approxHeaderHeight = Platform.OS === 'ios' ? 90 : 60;
  const approxTabBarHeight = Platform.OS === 'ios' ? 80 : 60;
  const searchFilterHeight = 60;
  const cardHeight =
    screenHeight -
    layout.PAGER_VERTICAL_MARGIN * 2 -
    approxHeaderHeight -
    approxTabBarHeight -
    searchFilterHeight;

  const filters = useMemo((): CharacterFilters => {
    const activeFilters: CharacterFilters = { name: debouncedSearchTerm };
    if (appliedStatus !== 'All') activeFilters.status = appliedStatus;
    if (appliedGender !== 'All') activeFilters.gender = appliedGender;
    if (appliedSpecies.trim()) activeFilters.species = appliedSpecies.trim();
    if (appliedType.trim()) activeFilters.type = appliedType.trim();
    return activeFilters;
  }, [debouncedSearchTerm, appliedStatus, appliedGender, appliedSpecies, appliedType]);

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
  } = useCharacterList(filters);

  const characters = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  const {
    pagerRef,
    currentIndex,
    handlePrevious,
    handleNext,
    scrollToStart,
    onViewableItemsChanged,
    viewabilityConfig,
  } = usePager<Character>(characters.length);

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
    if (currentIndex >= characters.length - 3 && hasNextPage && !isFetchingNextPage) {
      loadNextPage();
    }
  }, [currentIndex, characters.length, hasNextPage, isFetchingNextPage, loadNextPage]);

  const applyFilters = (newFilters: {
    status: CharacterStatus | 'All';
    gender: CharacterGender | 'All';
    species: string;
    type: string;
  }) => {
    setAppliedStatus(newFilters.status);
    setAppliedGender(newFilters.gender);
    setAppliedSpecies(newFilters.species);
    setAppliedType(newFilters.type);
    setIsFilterModalVisible(false);
  };

  const renderCharacterCard = useCallback(
    ({ item }: ListRenderItemInfo<Character>) => {
      return (
        <CardOuterContainer screenWidth={screenWidth}>
          <CharacterCard item={item} width={cardWidth} height={cardHeight} />
        </CardOuterContainer>
      );
    },
    [screenWidth, cardWidth, cardHeight]
  );

  const activeFilterCount = [
    appliedStatus !== 'All',
    appliedGender !== 'All',
    !!appliedSpecies,
    !!appliedType,
  ].filter(Boolean).length;
  const showInitialLoading = isLoading && !searchTerm && activeFilterCount === 0;

  if (showInitialLoading) return <LoadingIndicator />;
  if (isError && !characters.length)
    return <ErrorDisplay message={error?.message} onRetry={refetch} />;

  return (
    <ScreenContainer>
      <SearchAndFilterContainer>
        <SearchInput
          placeholder="Search Characters..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <FilterButton onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons
            name="filter"
            size={24}
            color={activeFilterCount > 0 ? theme.colors.accent : theme.colors.primary}
          />
          {activeFilterCount > 0 && (
            <FilterBadge>
              <FilterBadgeText>{activeFilterCount}</FilterBadgeText>
            </FilterBadge>
          )}
        </FilterButton>

        {isFetching && !isLoading && !isFetchingNextPage && (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
      </SearchAndFilterContainer>

      <FlatList
        ref={pagerRef}
        data={characters}
        renderItem={renderCharacterCard}
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
                {searchTerm || activeFilterCount > 0
                  ? `No characters found matching current criteria.`
                  : 'No characters found.'}
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
          disabled={currentIndex >= characters.length - 1 && !hasNextPage}
        >
          <Ionicons
            name="arrow-forward-circle"
            size={40}
            color={
              currentIndex >= characters.length - 1 && !hasNextPage
                ? theme.colors.textDisabled
                : theme.colors.primary
            }
          />
        </ArrowButton>
      </ArrowContainer>

      <CharacterFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={applyFilters}
        currentFilters={{
          status: appliedStatus,
          gender: appliedGender,
          species: appliedSpecies,
          type: appliedType,
        }}
      />
    </ScreenContainer>
  );
}
