import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import type { CharacterStatus, CharacterGender } from '@/types/api';
import {
  FilterButton,
  FilterButtonText,
  FilterLabel,
  FilterOptionContainer,
  FilterSection,
  FilterTextInput,
  ModalActions,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from './styles';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/constants/layout';

type FilterOptions = {
  status: CharacterStatus | 'All';
  gender: CharacterGender | 'All';
  species: string;
  type: string;
};

interface CharacterFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function CharacterFilterModal ({
  isVisible,
  onClose,
  onApply,
  currentFilters,
}: CharacterFilterModalProps) {
  const theme = useTheme();

  const [ tempStatus, setTempStatus ] = useState(currentFilters.status);
  const [ tempGender, setTempGender ] = useState(currentFilters.gender);
  const [ tempSpecies, setTempSpecies ] = useState(currentFilters.species);
  const [ tempType, setTempType ] = useState(currentFilters.type);

  useEffect(() => {
    if (isVisible) {
      setTempStatus(currentFilters.status);
      setTempGender(currentFilters.gender);
      setTempSpecies(currentFilters.species);
      setTempType(currentFilters.type);
    }
  }, [ isVisible, currentFilters ]);

  const handleApply = () => {
    onApply({
      status: tempStatus,
      gender: tempGender,
      species: tempSpecies,
      type: tempType,
    });
  };

  const handleReset = () => {
    setTempStatus('All');
    setTempGender('All');
    setTempSpecies('');
    setTempType('');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filters</ModalTitle>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </ModalHeader>

          <ScrollView showsVerticalScrollIndicator={false}>
            <FilterSection>
              <FilterLabel>Status</FilterLabel>
              <FilterOptionContainer>
                {STATUS_OPTIONS.map((status) => (
                  <FilterButton
                    key={status}
                    isActive={tempStatus === status}
                    onPress={() => setTempStatus(status)}
                  >
                    <FilterButtonText isActive={tempStatus === status}>{status}</FilterButtonText>
                  </FilterButton>
                ))}
              </FilterOptionContainer>
            </FilterSection>

            <FilterSection>
              <FilterLabel>Gender</FilterLabel>
              <FilterOptionContainer>
                {GENDER_OPTIONS.map((gender) => (
                  <FilterButton
                    key={gender}
                    isActive={tempGender === gender}
                    onPress={() => setTempGender(gender)}
                  >
                    <FilterButtonText isActive={tempGender === gender}>{gender}</FilterButtonText>
                  </FilterButton>
                ))}
              </FilterOptionContainer>
            </FilterSection>

            <FilterSection>
              <FilterLabel>Species</FilterLabel>
              <FilterTextInput
                placeholder="e.g., Human, Alien..."
                value={tempSpecies}
                onChangeText={setTempSpecies}
                autoCapitalize="words"
              />
            </FilterSection>

            <FilterSection>
              <FilterLabel>Type</FilterLabel>
              <FilterTextInput
                placeholder="e.g., Fish-Person, Robot..."
                value={tempType}
                onChangeText={setTempType}
                autoCapitalize="words"
              />
            </FilterSection>

          </ScrollView>
          <ModalActions>
            <Button title="Reset" onPress={handleReset} color={theme.colors.primary} />
            <Button title="Apply Filters" onPress={handleApply} color={theme.colors.primary} />
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}
