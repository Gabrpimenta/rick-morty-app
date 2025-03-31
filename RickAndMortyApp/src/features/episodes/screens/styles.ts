import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import * as layout from '@/constants/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fetchingIndicator: {
    alignSelf: 'center',
    marginTop: -layout.SCREEN_PADDING / 4,
    marginBottom: layout.SCREEN_PADDING / 2,
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

export const FilterInputContainer = styled.View`
  padding: ${layout.SCREEN_PADDING / 2}px ${layout.SCREEN_PADDING}px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

export const FilterInput = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.theme.colors.textSecondary,
}))`
  height: 40px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding-left: ${(props) => props.theme.spacing.medium}px;
  padding-right: ${(props) => props.theme.spacing.medium}px;
  margin-bottom: ${(props) => props.theme.spacing.small}px;
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  font-family: ${(props) => props.theme.typography.fontFamilyRegular};
  color: ${(props) => props.theme.colors.textPrimary};
  background-color: ${(props) => props.theme.colors.surface};
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
