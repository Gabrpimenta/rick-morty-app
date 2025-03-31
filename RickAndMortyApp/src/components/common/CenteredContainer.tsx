import styled from 'styled-components/native';

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.large}px;
  background-color: ${(props) => props.theme.colors.background};
`;
