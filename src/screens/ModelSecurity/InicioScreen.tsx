import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { tokenValido } from '../../util/TokenManager';

const { width } = Dimensions.get('window');

const InicioScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && tokenValido(token)) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [loading, token, navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E1E50" />
      </View>
    );
  }

  // Si no hay token válido, mostramos la pantalla de bienvenida
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/curvas.png')} style={styles.curves} />
      <Image source={require('../../assets/logo_colegio.png')} style={styles.logo} />
      <Image source={require('../../assets/ilustracion_inicio.png')} style={styles.illustration} />

      <Text style={styles.title}>Bienvenidos a DR PHILIPS Mobil</Text>
      <Text style={styles.subtitle}>
        Lleva tu proceso educativo desde casa, y vive una experiencia más cómoda desde cualquier parte del mundo!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InicioScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  curves: {
    position: 'absolute',
    top: -16,
    left: 0,
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  logo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  illustration: {
    width: 220,
    height: 220,
    marginTop: 80,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1E1E50',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
