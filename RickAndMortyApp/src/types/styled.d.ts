import 'styled-components/native';

interface Typography {
  fontFamilyRegular: string;
  fontFamilyBold: string;
  fontSizeH1: number;
  fontSizeH2: number;
  fontSizeTitle: number;
  fontSizeBody: number;
  fontSizeCaption: number;
  fontWeightRegular: '400';
  fontWeightBold: '700';
}

interface Spacing {
  xxsmall: number;
  xsmall: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
  xxlarge: number;
}

declare module 'styled-components/native' {
  export interface DefaultTheme {
    isDark: boolean;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      textPrimary: string;
      textSecondary: string;
      textDisabled: string;
      border: string;
      error: string;
      statusAlive: string;
      statusDead: string;
      statusUnknown: string;
    };
    typography: Typography;
    spacing: Spacing;
  }
}
