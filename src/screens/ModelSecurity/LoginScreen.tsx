import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator'; // ✅ CORRECTO

import CustomInput from '../../components/Genericos/CustomInput';
import CustomButton from '../../components/Genericos/CustomButton';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    const emailClean = email.trim().toLowerCase();
    const passwordClean = password.trim();

    const emailValid = emailClean !== '';
    const passwordValid = passwordClean !== '';

    setEmailError(!emailValid);
    setPasswordError(!passwordValid);

    if (!emailValid || !passwordValid) {
      setErrorMessage('Por favor completa todos los campos para continuar.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      await login(emailClean, passwordClean);
      navigation.replace('Main');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredContent}
      >
        <View style={styles.formContainer}>
          <Image source={require('../../assets/curvas.png')} style={styles.curves} />
          <Image source={require('../../assets/ilustracion_login.png')} style={styles.illustration} />

          <CustomInput
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            hasError={emailError}
          />
          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            hasError={passwordError}
          />

          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
          </TouchableOpacity>

          <CustomButton title={loading ? 'Ingresando...' : 'Ingresar'} onPress={handleLogin} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  curves: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    opacity: 0.3,
  },
  illustration: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#1E1E50',
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
