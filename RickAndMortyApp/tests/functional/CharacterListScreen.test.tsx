import React from 'react';
import { View, Text } from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.FlatList = ({ data = [], renderItem, keyExtractor = (item: any) => item.id?.toString(), ...props }) => {
    const React = require('react');
    const { View } = require('react-native');
    return (
      <View {...props} testID="mock-flatlist">
        {data?.map((item: any, index: number) => {
          const element = renderItem({ item, index, separators: {} });
          return element ? React.cloneElement(element, { ...element.props, key: keyExtractor(item) }) : null;
        })}
      </View>
    );
  };
  return RN;
});

import { CharacterListScreen } from '@/features/characters/screens/CharacterListScreen';
import * as CharacterListHook from '@/features/characters/hooks/useCharacterList';
import * as DebounceHook from '@/hooks/useDebounce';
import { fireEvent, render, screen, waitFor } from '../test-utils';

const mockCharacter1 = { id: 1, name: 'Rick Sanchez' };
const mockCharacter2 = { id: 2, name: 'Morty Smith' };
const initialPage = { info: { count: 2, pages: 1, next: null, prev: null }, results: [ mockCharacter1, mockCharacter2 ] };
const filteredPage = { info: { count: 1, pages: 1, next: null, prev: null }, results: [ mockCharacter1 ] };
const emptyPage = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

jest.spyOn(DebounceHook, 'useDebounce').mockImplementation((value) => value);

jest.mock('@/components/InteractiveCard/CharacterCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    CharacterCard: ({ item }: { item: { id: number, name: string } }) => (
      <View testID={`character-card-${item.id}`}>
        <Text>{item.name}</Text>
      </View>
    )
  };
});
jest.mock('@/features/characters/components/CharacterFilterModal', () => {
  const { View } = require('react-native');
  return {
    CharacterFilterModal: ({ isVisible }: { isVisible: boolean }) => isVisible ? <View testID="filter-modal" /> : null
  };
});

describe('CharacterListScreen', () => {
  let useCharacterListMock: jest.SpyInstance;

  beforeEach(() => { });

  it('renders initial characters', async () => {
    render(<CharacterListScreen />);
    expect(await screen.findByTestId('character-card-1')).toBeTruthy();
    expect(await screen.findByTestId('character-card-2')).toBeTruthy();
    expect(screen.getByText('Rick Sanchez')).toBeTruthy();
    expect(screen.getByText('Morty Smith')).toBeTruthy();
  });

  it('filters characters by name input', async () => {
    useCharacterListMock.mockImplementation((filters) => {
      const mockReturnValueFiltered = { data: { pages: [ filteredPage ], pageParams: [ 1 ] } } as any;
      const mockReturnValueInitial = { data: { pages: [ initialPage ], pageParams: [ 1 ] } } as any;
      return filters?.name === 'Rick' ? mockReturnValueFiltered : mockReturnValueInitial;
    });
    render(<CharacterListScreen />);
    const searchInput = screen.getByPlaceholderText(/Search Characters/i);
    fireEvent.changeText(searchInput, 'Rick');
    expect(await screen.findByTestId('character-card-1')).toBeTruthy();
    expect(screen.getByText('Rick Sanchez')).toBeTruthy();
    await waitFor(() => expect(screen.queryByTestId('character-card-2')).toBeNull());
    await waitFor(() => expect(screen.queryByText('Morty Smith')).toBeNull());
    expect(useCharacterListMock).toHaveBeenCalledWith({ name: 'Rick' });
  });

  it('shows empty message when filter yields no results', async () => {
    useCharacterListMock.mockImplementation((filters) => {
      const mockReturnValueEmpty = { data: { pages: [ emptyPage ], pageParams: [ 1 ] } } as any;
      const mockReturnValueInitial = { data: { pages: [ initialPage ], pageParams: [ 1 ] } } as any;
      return filters?.name === 'Zzzz' ? mockReturnValueEmpty : mockReturnValueInitial;
    });
    render(<CharacterListScreen />);
    const searchInput = screen.getByPlaceholderText(/Search Characters/i);
    fireEvent.changeText(searchInput, 'Zzzz');
    const emptyMessage = await screen.findByText(/No characters found matching current criteria/i);
    expect(emptyMessage).toBeTruthy();
    expect(screen.queryByTestId('character-card-1')).toBeNull();
    expect(screen.queryByTestId('character-card-2')).toBeNull();
  });
});
