import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  type ListRenderItemInfo
} from 'react-native';
import { useCharacterList } from '../hooks/useCharacterList';
import { CharacterCard } from '@/components/InteractiveCard/CharacterCard';
import type { Character } from '@/types/api';
import { useTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { InfoText } from '@/components/common/InfoText';
import { CenteredContainer } from '@/components/common/CenteredContainer';
import { CARD_VERTICAL_MARGIN, HORIZONTAL_PADDING, styles } from './styles';


export function CharacterListScreen () {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const flatListRef = useRef<FlatList<Character>>(null);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  const cardWidth = screenWidth - HORIZONTAL_PADDING * 2;
  const cardHeight = screenHeight - CARD_VERTICAL_MARGIN * 2 - 50 - 60;

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
  } = useCharacterList(filters);

  // Flatten data as before
  const characters = useMemo(() => {
    return data?.pages.flatMap(page => page.results) ?? [];
  }, [ data ]);

  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleScrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < characters.length) {
      flatListRef.current.scrollToIndex({ animated: true, index });
      setCurrentIndex(index); // Update state
    }
  };

  const handlePrevious = () => {
    handleScrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex >= characters.length - 5 && hasNextPage) {
      loadNextPage();
    }
    handleScrollToIndex(currentIndex + 1);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems[ 0 ] && viewableItems[ 0 ].index !== null) {
      setCurrentIndex(viewableItems[ 0 ].index);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;


  const renderCharacterCard = ({ item }: ListRenderItemInfo<Character>) => {
    return (
      <View style={[ styles.cardContainer, { width: screenWidth } ]}>
        <CharacterCard
          item={item}
          width={cardWidth}
          height={cardHeight}
        />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError && !characters.length) {
    return <ErrorDisplay message={error?.message || 'Failed to load data'} onRetry={refetch} />;
  }

  return (
    <View style={[ styles.container, { backgroundColor: theme.colors.background } ]}>
      <FlatList
        ref={flatListRef}
        data={characters}
        renderItem={renderCharacterCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={1}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View style={[ styles.cardContainer, styles.centerContent, { width: screenWidth / 2 } ]}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !isFetching ? (
            <CenteredContainer style={{ width: screenWidth }}>
              <InfoText>No characters found.</InfoText>
            </CenteredContainer>
          ) : null
        }
      />

      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentIndex <= 0} style={styles.arrowButton}>
          <Ionicons name="arrow-back-circle" size={40} color={currentIndex <= 0 ? theme.colors.textDisabled : theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} disabled={currentIndex >= characters.length - 1 && !hasNextPage} style={styles.arrowButton}>
          <Ionicons name="arrow-forward-circle" size={40} color={(currentIndex >= characters.length - 1 && !hasNextPage) ? theme.colors.textDisabled : theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

