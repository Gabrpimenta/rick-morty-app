import React from 'react';
import { Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderContainer = styled.View<{ paddingTop: number }>`
  padding-top: ${(props) => props.paddingTop}px;
  padding-bottom: ${(props) => props.theme.spacing.small}px;
  padding-left: ${(props) => props.theme.spacing.medium}px;
  padding-right: ${(props) => props.theme.spacing.medium}px;
  background-color: ${(props) => props.theme.colors.primary};
  ${Platform.OS === 'android' ? 'elevation: 4;' : ''}
  ${Platform.OS === 'ios' ? 'box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);' : ''}
`;

const HeaderTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.fontSizeH1}px;
  font-family: ${(props) => props.theme.typography.fontFamilyBold};
  color: ${(props) =>
    props.theme.isDark ? props.theme.colors.almostBlack : props.theme.colors.white};
  text-align: center;
`;

export function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer paddingTop={insets.top}>
      <HeaderTitle>Rick and Morty</HeaderTitle>
    </HeaderContainer>
  );
}
