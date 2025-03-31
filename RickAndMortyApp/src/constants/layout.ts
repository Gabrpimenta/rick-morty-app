import { CharacterGender, CharacterStatus } from '@/types/api';

// General List/Screen Padding
export const SCREEN_PADDING = 16;
export const LIST_ITEM_MARGIN_BOTTOM = 16;
export const LIST_PADDING = 16;

// Card Specific
export const CARD_BORDER_RADIUS_DEFAULT = 10;
export const CARD_BORDER_RADIUS_CHARACTER = 14;
export const CARD_INTERNAL_PADDING = 14;

// Character Card Specific
export const CHARACTER_CARD_HEIGHT = 320;
export const CHARACTER_CARD_OVERLAY_RATIO = 0.4;
export const CHARACTER_CARD_STATUS_RADIUS = 5;
export const CHARACTER_CARD_TEXT_GAP = 5;
export const CARD_BORDER_RADIUS = 14;
export const PADDING = 14;
export const OVERLAY_HEIGHT_RATIO = 0.4;
export const STATUS_INDICATOR_RADIUS = 5;
export const TEXT_LINE_HEIGHT_GAP = 5;
export const ROTATION_LIMIT = 20;
export const SPRING_CONFIG = {
  mass: 1,
  damping: 18,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};
export const PERSPECTIVE = 800;

// Episode Card Specific
export const EPISODE_CARD_HEIGHT = 120;
export const EPISODE_BORDER_RADIUS = 10;
export const EPISODE_PADDING = 12;
export const EPISODE_TEXT_LINE_HEIGHT_GAP = 5;

// Pager/Carousel Specific (from List Screens)
export const PAGER_HORIZONTAL_PADDING = 20;
export const PAGER_VERTICAL_MARGIN = 40;

// Fonts
export const FONT_FAMILY_REGULAR = 'Exo2-Regular';
export const FONT_FAMILY_BOLD = 'Exo2-Bold';

// Character Filters
export const GENDER_OPTIONS: (CharacterGender | 'All')[] = [
  'All',
  'Female',
  'Male',
  'Genderless',
  'unknown',
];
export const STATUS_OPTIONS: (CharacterStatus | 'All')[] = ['All', 'Alive', 'Dead', 'unknown'];
