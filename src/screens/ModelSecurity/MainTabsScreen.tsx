import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from '../../components/Narvar/Navbar';
import MainMenuScreen from './MainMenuScreen';
import PerfilScreen from '../PerfilScreen';
import NotificacionesScreen from '../NotificacionesScreen';
import AjustesScreen from '../AjustesScreen';

const MainTabsScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <MainMenuScreen />;
      case 1:
        return <PerfilScreen />;
      case 2:
        return <AjustesScreen />;
      default:
        return <MainMenuScreen />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

export default MainTabsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingBottom: 60, // espacio para la navbar
  },
});
