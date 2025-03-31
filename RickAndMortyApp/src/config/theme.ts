import { FONT_FAMILY_BOLD, FONT_FAMILY_REGULAR } from '@/constants/layout';
import { DefaultTheme } from 'styled-components/native';

const colors = {
  portalGreen: '#97F02A',
  portalGreenDark: '#8BDE3A',
  ricksBlue: '#A0D9E7',
  ricksBlueDark: '#64C4DC',
  deepSpaceBlue: '#0B1E25',
  mortysYellow: '#F0E14A',
  white: '#FFFFFF',
  lightGrey: '#F5F5F5',
  mediumGrey: '#CCCCCC',
  darkGrey: '#333333',
  almostBlack: '#121212',
  black: '#000000',
  statusAlive: '#55CC44',
  statusDead: '#D63D2E',
  statusUnknown: '#AAAAAA',
  purpleAccent: '#7B2CBF',
};

const typography = {
  fontFamilyRegular: FONT_FAMILY_REGULAR,
  fontFamilyBold: FONT_FAMILY_BOLD,
  fontSizeH1: 28,
  fontSizeH2: 24,
  fontSizeTitle: 18,
  fontSizeBody: 14,
  fontSizeCaption: 12,
  fontWeightRegular: '400' as const,
  fontWeightBold: '700' as const,
};

const spacing = {
  xxsmall: 4,
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

export const lightTheme: DefaultTheme = {
  isDark: false,
  colors: {
    primary: colors.ricksBlueDark,
    secondary: colors.mortysYellow,
    accent: colors.portalGreen,
    background: colors.lightGrey,
    surface: colors.white,
    textPrimary: colors.almostBlack,
    textSecondary: '#555555',
    textDisabled: colors.mediumGrey,
    border: colors.mediumGrey,
    error: colors.statusDead,
    statusAlive: colors.statusAlive,
    statusDead: colors.statusDead,
    statusUnknown: colors.statusUnknown,
  },
  typography: typography,
  spacing: spacing,
};

export const darkTheme: DefaultTheme = {
  isDark: true,
  colors: {
    primary: colors.portalGreen,
    secondary: colors.ricksBlue,
    accent: colors.mortysYellow,
    background: colors.almostBlack,
    surface: colors.darkGrey,
    textPrimary: colors.white,
    textSecondary: '#F5F5F5',
    textDisabled: '#777777',
    border: '#444444',
    error: '#CF6679',
    statusAlive: colors.statusAlive,
    statusDead: colors.statusDead,
    statusUnknown: colors.statusUnknown,
  },
  typography: typography,
  spacing: spacing,
};
