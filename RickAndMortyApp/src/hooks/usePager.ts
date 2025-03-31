import { useState, useRef, useCallback } from 'react';
import { FlatList } from 'react-native';

type ListItem = { id: number | string };

export function usePager<T extends ListItem>(itemCount: number) {
  const pagerRef = useRef<FlatList<T>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollToIndex = useCallback(
    (index: number) => {
      if (pagerRef.current && index >= 0 && index < itemCount) {
        pagerRef.current.scrollToIndex({ animated: true, index });
      }
    },
    [itemCount]
  );

  const handlePrevious = useCallback(() => {
    handleScrollToIndex(currentIndex - 1);
  }, [currentIndex, handleScrollToIndex]);

  const handleNext = useCallback(() => {
    handleScrollToIndex(currentIndex + 1);
  }, [currentIndex, handleScrollToIndex]);

  const scrollToStart = useCallback(() => {
    if (pagerRef.current) {
      pagerRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    setCurrentIndex(0);
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null; item: T }> }) => {
      if (viewableItems[0] && viewableItems[0].index !== null) {
        setCurrentIndex((prevIndex) => {
          if (prevIndex !== viewableItems[0].index) {
            return viewableItems[0].index ?? 0;
          }
          return prevIndex;
        });
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return {
    pagerRef,
    currentIndex,
    handlePrevious,
    handleNext,
    scrollToStart,
    onViewableItemsChanged,
    viewabilityConfig,
  };
}
