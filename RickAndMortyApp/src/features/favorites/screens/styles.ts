import { StyleSheet, Text } from 'react-native';
import { styled } from 'styled-components';

const LIST_PADDING = 16;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: LIST_PADDING,
    paddingBottom: LIST_PADDING,
  },
});

export const SectionHeaderText = styled(Text)`
  font-size: ${(props) => props.theme.typography.fontSizeH2}px;
  font-family: ${(props) => props.theme.typography.fontFamilyBold};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.small}px;
  margin-top: ${(props) => props.theme.spacing.large}px;
`;
