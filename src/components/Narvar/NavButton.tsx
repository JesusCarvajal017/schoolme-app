import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconName =
  | 'home-outline'
  | 'person-outline'
  | 'settings-outline';

type Props = {
  icon: IconName;
  active: boolean;
  onPress: () => void;
};

const NavButton = ({ icon, active, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={active ? '#fff' : '#1E1E50'}
      />
    </TouchableOpacity>
  );
};

export default NavButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeButton: {
    backgroundColor: '#1E1E50',
    borderRadius: 30,
  },
});
