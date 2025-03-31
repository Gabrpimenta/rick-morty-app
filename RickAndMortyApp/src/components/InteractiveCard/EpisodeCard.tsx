import React from 'react';
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  Text as SkiaText,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/rootReducer';
import { lightTheme, darkTheme } from '@/config/theme';
import type { Episode } from '@/types/api';

interface EpisodeCardProps {
  item: Episode;
  width: number;
  height: number;
}

// Card Constants
const CARD_BORDER_RADIUS = 10;
const PADDING = 12;
const TEXT_LINE_HEIGHT_GAP = 5;

export function EpisodeCard({ item, width, height }: EpisodeCardProps) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const regularFont = useFont(
    require('@/assets/fonts/Exo2-Regular.ttf'),
    theme.typography.fontSizeBody
  );
  const titleFont = useFont(
    require('@/assets/fonts/Exo2-Bold.ttf'),
    theme.typography.fontSizeTitle
  );
  const captionFont = useFont(
    require('@/assets/fonts/Exo2-Regular.ttf'),
    theme.typography.fontSizeCaption
  );

  if (!regularFont || !titleFont || !captionFont) {
    return (
      <Canvas style={{ width, height }}>
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={CARD_BORDER_RADIUS}
          color={theme.colors.surface}
        />
      </Canvas>
    );
  }

  return (
    <Canvas
      style={{ width, height }}
      accessibilityLabel={`Episode card for ${item.name} (${item.episode})`}
    >
      <RoundedRect
        x={0}
        y={0}
        width={width}
        height={height}
        r={CARD_BORDER_RADIUS}
        color={theme.colors.surface}
      />
      <RoundedRect x={0} y={0} width={width} height={height} r={CARD_BORDER_RADIUS}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={[theme.colors.surface, theme.isDark ? '#444' : '#eee']}
        />
      </RoundedRect>
      <SkiaText
        x={PADDING}
        y={PADDING + theme.typography.fontSizeTitle}
        font={titleFont}
        color={theme.colors.textPrimary}
        text={item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name}
      />
      <SkiaText
        x={PADDING}
        y={
          PADDING +
          theme.typography.fontSizeTitle +
          TEXT_LINE_HEIGHT_GAP +
          theme.typography.fontSizeBody
        }
        text={item.episode}
        font={regularFont}
        color={theme.colors.textSecondary}
      />
      <SkiaText
        x={PADDING}
        y={height - PADDING - theme.typography.fontSizeCaption / 2}
        text={`Aired: ${item.air_date}`}
        font={captionFont}
        color={theme.colors.textSecondary}
      />
    </Canvas>
  );
}
