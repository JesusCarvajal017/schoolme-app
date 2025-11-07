import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  RefreshControl, 
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Menu/Header';
import Carousel from '../../components/Menu/Carousel';
import MessageBox from '../../components/Menu/MessageBox';
import SideMenu from '../../modals/SideMenu';
import HelpModal from '../../modals/HelpModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AuthContext } from '../../context/AuthContext';

const MainMenuScreen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout, refreshUserData, user, person, error } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !person) {
      refreshUserData().catch(err => {
        console.error("Error al cargar datos iniciales:", err);
      });
    }
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Aviso',
        'Hubo un problema al cargar algunos datos. Desliza hacia abajo para actualizar.',
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Inicio');
    } catch (err) {
      console.error("Error durante logout:", err);
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (err) {
      console.error("Error al refrescar datos:", err);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Gradiente de fondo */}
      <LinearGradient
        colors={['#4C1D95', '#5B21B6', '#6366F1', '#8B5CF6']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Efectos decorativos de fondo */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
            progressBackgroundColor="#FFFFFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Header
          onMenuPress={() => setShowMenu(true)}
          onHelpPress={() => setShowHelp(true)}
        />
        <Carousel />
        <MessageBox />
      </ScrollView>
      
      <SideMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        navigation={navigation}
      />
      
      <HelpModal 
        visible={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C1D95',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    bottom: 100,
    left: -40,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    top: 200,
    left: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
});

export default MainMenuScreen;