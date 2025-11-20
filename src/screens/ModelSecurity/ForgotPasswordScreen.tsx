import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { sendResetCode } from '../../api/services/authService';
import CustomInput from '../../components/Genericos/CustomInput';
import CustomButton from '../../components/Genericos/CustomButton';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    const emailClean = email.trim().toLowerCase();

    if (!emailClean) {
      setEmailError(true);
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(emailClean)) {
      setEmailError(true);
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setEmailError(false);

    try {
      setLoading(true);
      const response = await sendResetCode(emailClean);

      if (response.status === true) {
        navigation.navigate('VerificationCode', { email: emailClean });
      } else {
        Alert.alert('Error', response.description || 'No se pudo enviar el código');
      }
    } catch (error: any) {
      console.error('Error sending reset code:', error);
      Alert.alert('Error', 'No se pudo enviar el código. Verifica tu conexión e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000928', '#091645ff', '#0c0e6fff', '#071e85ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.decorativeCircle} />
        <View style={styles.decorativeCircleSmall} />
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🔐</Text>
          <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              No te preocupes, te ayudaremos a recuperarla. Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </Text>

            <View style={styles.inputContainer}>
              <CustomInput
                label="Correo Electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(false);
                }}
                placeholder="ejemplo@correo.com"
                hasError={emailError}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={loading ? 'Enviando...' : 'Enviar Código de Verificación'}
                onPress={handleSendCode}
              />
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Volver al Inicio de Sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#1E1E50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(30, 30, 80, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  backButtonText: {
    color: '#1E1E50',
    fontSize: 16,
    fontWeight: '600',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -20,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -10,
    left: -10,
  },
});

export default ForgotPasswordScreen;