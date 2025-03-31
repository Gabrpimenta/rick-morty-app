import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Text as SkiaText,
  useFonts,
  matchFont,
  type SkFont,
} from '@shopify/react-native-skia';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootState } from '@/store/rootReducer';
import { lightTheme, darkTheme } from '@/config/theme';
import type { Episode } from '@/types/api';

import { useIsFavorite } from '@/features/favorites/hooks/useIsFavorite';
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '@/features/favorites/hooks/useFavoriteMutations';
import { ItemType } from '@/types/common';
import {
  EPISODE_BORDER_RADIUS,
  EPISODE_PADDING,
  EPISODE_TEXT_LINE_HEIGHT_GAP,
} from '@/constants/layout';

interface EpisodeCardProps {
  item: Episode;
  width: number;
  height: number;
}

export function EpisodeCard({ item, width, height }: EpisodeCardProps) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const fontMgr = useFonts({
    Exo2: [require('@/assets/fonts/Exo2-Regular.ttf'), require('@/assets/fonts/Exo2-Bold.ttf')],
  });

  const itemType: ItemType = 'episode';
  const { data: isFavorited, isLoading: isLoadingFavoriteStatus } = useIsFavorite(
    itemType,
    item.id
  );
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const textColor = theme.colors.textPrimary;
  const textSecondaryColor = theme.colors.textSecondary;

  const titleStyle = {
    fontFamily: 'Exo2',
    fontSize: theme.typography.fontSizeTitle,
    fontWeight: theme.typography.fontWeightBold,
  } as const;
  const regularStyle = {
    fontFamily: 'Exo2',
    fontSize: theme.typography.fontSizeBody,
    fontWeight: theme.typography.fontWeightRegular,
  } as const;
  const captionStyle = {
    fontFamily: 'Exo2',
    fontSize: theme.typography.fontSizeCaption,
    fontWeight: theme.typography.fontWeightRegular,
  } as const;

  const titleFont: SkFont | null = fontMgr ? matchFont(titleStyle, fontMgr) : null;
  const regularFont: SkFont | null = fontMgr ? matchFont(regularStyle, fontMgr) : null;
  const captionFont: SkFont | null = fontMgr ? matchFont(captionStyle, fontMgr) : null;

  const handleFavoriteToggle = () => {
    if (
      isLoadingFavoriteStatus ||
      addFavoriteMutation.isPending ||
      removeFavoriteMutation.isPending
    )
      return;

    if (isFavorited) {
      removeFavoriteMutation.mutate({ itemType: itemType, itemId: item.id });
    } else {
      addFavoriteMutation.mutate({ itemType: itemType, item: item });
    }
  };

  if (!fontMgr || !titleFont || !regularFont || !captionFont) {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: theme.colors.surface,
          borderRadius: EPISODE_BORDER_RADIUS,
        }}
      />
    );
  }

  return (
    <View style={[styles.cardContainer, { width, height }]}>
      <Canvas
        style={StyleSheet.absoluteFill}
        accessibilityLabel={`Episode card for ${item.name} (${item.episode})`}
      >
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={EPISODE_BORDER_RADIUS}
          color={theme.colors.surface}
        />
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={EPISODE_BORDER_RADIUS}
          style="stroke"
          strokeWidth={1}
          color={theme.colors.border}
        />

        <SkiaText
          x={EPISODE_PADDING}
          y={EPISODE_PADDING + theme.typography.fontSizeTitle * 0.8}
          text={item.name ?? ''}
          font={titleFont}
          color={textColor}
        />

        <SkiaText
          x={EPISODE_PADDING}
          y={
            EPISODE_PADDING +
            theme.typography.fontSizeTitle +
            EPISODE_TEXT_LINE_HEIGHT_GAP +
            theme.typography.fontSizeBody * 0.8
          }
          text={item.episode ?? ''}
          font={regularFont}
          color={textSecondaryColor}
        />

        <SkiaText
          x={EPISODE_PADDING}
          y={height - EPISODE_PADDING - theme.typography.fontSizeCaption * 0.2}
          text={`Aired: ${item.air_date ?? 'Unknown'}`}
          font={captionFont}
          color={textSecondaryColor}
        />
      </Canvas>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
        disabled={
          isLoadingFavoriteStatus ||
          addFavoriteMutation.isPending ||
          removeFavoriteMutation.isPending
        }
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFavorited ? 'heart' : 'heart-outline'}
          size={28}
          color={isFavorited ? theme.colors.error : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    borderRadius: EPISODE_BORDER_RADIUS,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: EPISODE_PADDING / 2,
    right: EPISODE_PADDING / 2,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 18,
  },
});
