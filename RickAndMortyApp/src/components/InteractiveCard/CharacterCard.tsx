import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Text as SkiaText,
  useImage,
  Image as SkiaImage,
  vec,
  LinearGradient,
  Circle,
  Group,
  Rect,
  useFonts,
  matchFont,
  type SkFont,
} from '@shopify/react-native-skia';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { RootState } from '@/store/rootReducer';
import { lightTheme, darkTheme } from '@/config/theme';
import type { Character } from '@/types/api';
import { useIsFavorite } from '@/features/favorites/hooks/useIsFavorite';
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '@/features/favorites/hooks/useFavoriteMutations';

interface CharacterCardProps {
  item: Character;
  width: number;
  height: number;
}

// --- Constants ---
const CARD_BORDER_RADIUS = 14;
const PADDING = 14;
const OVERLAY_HEIGHT_RATIO = 0.4;
const STATUS_INDICATOR_RADIUS = 5;
const TEXT_LINE_HEIGHT_GAP = 5;
const ROTATION_LIMIT = 20;
const SPRING_CONFIG = {
  mass: 1,
  damping: 18,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};
const PERSPECTIVE = 800;

export function CharacterCard({ item, width, height }: CharacterCardProps) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const fontMgr = useFonts({
    Exo2: [require('@/assets/fonts/Exo2-Regular.ttf'), require('@/assets/fonts/Exo2-Bold.ttf')],
  });

  const image = useImage(item.image);

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // --- Calculations ---
  const overlayHeight = height * OVERLAY_HEIGHT_RATIO;
  const overlayY = height - overlayHeight;
  const textStartY = overlayY + PADDING;

  const overlayStartColor = theme.isDark ? 'rgba(18, 18, 18, 0)' : 'rgba(255, 255, 255, 0)';
  const overlayEndColor = theme.isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(245, 245, 245, 0.95)';
  const overlayTextColor = theme.isDark ? theme.colors.textPrimary : theme.colors.textSecondary;
  const overlayTextSecondaryColor = theme.isDark ? theme.colors.textSecondary : '#555';

  let statusColor = theme.colors.statusUnknown;
  if (item.status === 'Alive') statusColor = theme.colors.statusAlive;
  else if (item.status === 'Dead') statusColor = theme.colors.statusDead;

  // --- Gesture Handling ---
  const panGesture = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      'worklet';
      rotateY.value = interpolate(
        event.translationX,
        [-width / 2, width / 2],
        [-ROTATION_LIMIT, ROTATION_LIMIT],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      rotateX.value = interpolate(
        event.translationY,
        [-height / 2, height / 2],
        [ROTATION_LIMIT, -ROTATION_LIMIT],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    })
    .onEnd(() => {
      'worklet';
      rotateX.value = withSpring(0, SPRING_CONFIG);
      rotateY.value = withSpring(0, SPRING_CONFIG);
    });

  // --- Animated Style for Wrapper View ---
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const rotateXdeg = `${rotateX.value}deg`;
    const rotateYdeg = `${rotateY.value}deg`;
    return {
      transform: [{ perspective: PERSPECTIVE }, { rotateX: rotateXdeg }, { rotateY: rotateYdeg }],
    };
  });

  const { data: isFavorited, isLoading: isLoadingFavoriteStatus } = useIsFavorite(
    'character',
    item.id
  );
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

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

  if (!fontMgr || !titleFont || !regularFont || !captionFont) {
    return (
      <View style={{ width, height }}>
        <Canvas style={StyleSheet.absoluteFill}>
          <RoundedRect
            x={0}
            y={0}
            width={width}
            height={height}
            r={CARD_BORDER_RADIUS}
            color={theme.colors.surface}
          />
        </Canvas>
      </View>
    );
  }

  const handleFavoriteToggle = () => {
    if (
      isLoadingFavoriteStatus ||
      addFavoriteMutation.isPending ||
      removeFavoriteMutation.isPending
    ) {
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate({ itemType: 'character', itemId: item.id });
    } else {
      addFavoriteMutation.mutate({ itemType: 'character', item: item });
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ width, height, overflow: 'hidden' }, animatedStyle]}>
        <Canvas
          style={StyleSheet.absoluteFill}
          accessibilityLabel={`Character card for ${item.name}`}
        >
          <Group
            clip={{
              x: 0,
              y: 0,
              width: width,
              height: height,
              rx: CARD_BORDER_RADIUS,
              ry: CARD_BORDER_RADIUS,
            }}
          >
            {!image && <Rect x={0} y={0} width={width} height={100} color={theme.colors.surface} />}
            {image && (
              <SkiaImage image={image} fit="cover" x={0} y={0} width={width} height={height} />
            )}
            <Rect x={0} y={overlayY} width={width} height={overlayHeight}>
              <LinearGradient
                start={vec(width / 2, overlayY)}
                end={vec(width / 2, height)}
                colors={[overlayStartColor, overlayEndColor]}
              />
            </Rect>
          </Group>
          <SkiaText
            x={PADDING}
            y={textStartY + theme.typography.fontSizeTitle * 0.8}
            text={item.name ?? ''}
            font={titleFont}
            color={overlayTextColor}
          />
          <Circle
            cx={PADDING + STATUS_INDICATOR_RADIUS}
            cy={
              textStartY +
              theme.typography.fontSizeTitle +
              TEXT_LINE_HEIGHT_GAP +
              theme.typography.fontSizeBody * 0.5
            }
            r={STATUS_INDICATOR_RADIUS}
            color={statusColor}
          />
          <SkiaText
            x={PADDING + STATUS_INDICATOR_RADIUS * 2 + 4}
            y={
              textStartY +
              theme.typography.fontSizeTitle +
              TEXT_LINE_HEIGHT_GAP +
              theme.typography.fontSizeBody * 0.8
            }
            text={`${item.status ?? 'unknown'} - ${item.species ?? 'unknown'}`}
            font={regularFont}
            color={overlayTextSecondaryColor}
          />
          <SkiaText
            x={PADDING}
            y={
              textStartY +
              theme.typography.fontSizeTitle +
              TEXT_LINE_HEIGHT_GAP +
              theme.typography.fontSizeBody +
              TEXT_LINE_HEIGHT_GAP +
              theme.typography.fontSizeCaption * 0.8
            }
            text={`Last known: ${item.location?.name ?? 'unknown'}`}
            font={captionFont}
            color={overlayTextSecondaryColor}
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
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: PADDING,
    right: PADDING,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
});
