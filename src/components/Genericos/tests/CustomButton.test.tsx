import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  it('debe renderizar el texto correctamente', () => {
    const { getByText } = render(<CustomButton title="Press Me" onPress={() => {}} />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('debe llamar onPress cuando se presiona', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Press Me" onPress={mockOnPress} />);

    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // Nota: El componente no tiene prop disabled, así que no se puede probar disabled
  // Según el manual, pero en código actual no está implementado
});