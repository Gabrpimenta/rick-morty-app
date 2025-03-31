import { StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import * as layout from '@/constants/layout';

export const HORIZONTAL_PADDING = 20;
export const CARD_VERTICAL_MARGIN = 40;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: CARD_VERTICAL_MARGIN / 2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    pointerEvents: 'box-none',
  },
  arrowButton: {
    padding: 10,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

export const SearchAndFilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${layout.SCREEN_PADDING}px;
  padding-right: ${layout.SCREEN_PADDING}px;
  padding-top: ${layout.SCREEN_PADDING / 2}px;
  padding-bottom: ${layout.SCREEN_PADDING / 2}px;
  gap: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

export const SearchInput = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.theme.colors.textSecondary,
}))`
  flex: 1;
  height: 40px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding-left: ${(props) => props.theme.spacing.medium}px;
  padding-right: ${(props) => props.theme.spacing.medium}px;
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  font-family: ${(props) => props.theme.typography.fontFamilyRegular};
  color: ${(props) => props.theme.colors.textPrimary};
  background-color: ${(props) => props.theme.colors.surface};
`;

export const FilterButton = styled.TouchableOpacity`
  padding: 8px;
  position: relative;
`;

export const FilterBadge = styled.View`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: ${(props) => props.theme.colors.error};
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  padding-left: 4px;
  padding-right: 4px;
  justify-content: center;
  align-items: center;
`;

export const FilterBadgeText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;

export const CardOuterContainer = styled.View<{ screenWidth: number }>`
  width: ${(props) => props.screenWidth}px;
  justify-content: center;
  align-items: center;
  padding-left: ${layout.PAGER_HORIZONTAL_PADDING}px;
  padding-right: ${layout.PAGER_HORIZONTAL_PADDING}px;
`;

export const ArrowContainer = styled.View`
  position: absolute;
  bottom: ${layout.PAGER_VERTICAL_MARGIN / 2}px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${layout.PAGER_HORIZONTAL_PADDING}px;
  padding-right: ${layout.PAGER_HORIZONTAL_PADDING}px;
  pointer-events: box-none;
`;

export const ArrowButton = styled.TouchableOpacity`
  padding: 10px;
`;
