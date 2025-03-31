import styled from 'styled-components/native';
import * as layout from '@/constants/layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: layout.SCREEN_PADDING,
    paddingTop: layout.SCREEN_PADDING / 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
});

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.background};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: ${layout.SCREEN_PADDING}px;
  padding-bottom: 40px;
  max-height: 80%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${layout.LIST_ITEM_MARGIN_BOTTOM}px;
  padding-bottom: ${layout.SCREEN_PADDING / 2}px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

export const ModalTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.fontSizeH2}px;
  font-family: ${(props) => props.theme.typography.fontFamilyBold};
  color: ${(props) => props.theme.colors.textPrimary};
`;

export const FilterSection = styled.View`
  margin-bottom: ${layout.LIST_ITEM_MARGIN_BOTTOM}px;
`;

export const FilterLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.small}px;
  font-family: ${(props) => props.theme.typography.fontFamilyBold};
`;

export const FilterOptionContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.small}px;
`;

export const FilterTextInput = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.theme.colors.textSecondary,
}))`
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

export const FilterButton = styled.TouchableOpacity<{ isActive: boolean }>`
  padding-top: ${(props) => props.theme.spacing.xsmall}px;
  padding-bottom: ${(props) => props.theme.spacing.xsmall}px;
  padding-left: ${(props) => props.theme.spacing.small}px;
  padding-right: ${(props) => props.theme.spacing.small}px;
  border-radius: 15px;
  border: 1px solid
    ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.border)};
  background-color: ${(props) => (props.isActive ? props.theme.colors.primary : 'transparent')};
`;

export const FilterButtonText = styled.Text<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive
      ? props.theme.isDark
        ? props.theme.colors.almostBlack
        : props.theme.colors.white
      : props.theme.colors.textSecondary};
  font-family: ${(props) => props.theme.typography.fontFamilyRegular};
  font-size: ${(props) => props.theme.typography.fontSizeCaption}px;
`;
