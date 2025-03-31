import styled from 'styled-components/native';

export const InfoText = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizeBody}px;
  font-family: ${(props) => props.theme.typography.fontFamilyRegular};
  text-align: center;
`;
