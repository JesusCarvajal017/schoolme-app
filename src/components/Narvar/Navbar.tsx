import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavButton from './NavButton';

const tabs = [
  { icon: 'home-outline' },
  { icon: 'person-outline' },
  { icon: 'settings-outline' },
] as const;

type Props = {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        {tabs.map((tab, index) => (
          <NavButton
            key={index}
            icon={tab.icon}
            active={activeTab === index}
            onPress={() => setActiveTab(index)}
          />
        ))}
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
