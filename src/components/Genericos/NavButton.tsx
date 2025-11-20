import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
};

const NavButton = ({ label, icon, active, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons
        name={icon as any}
        size={24}
        color={active ? '#1E1E50' : '#999'}
      />
      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default NavButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeLabel: {
    color: '#1E1E50',
    fontWeight: 'bold',
  },
});
