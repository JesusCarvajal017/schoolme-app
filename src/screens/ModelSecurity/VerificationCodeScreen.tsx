import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { validateVerificationCode, sendResetCode } from '../../api/services/authService';
import CustomButton from '../../components/Genericos/CustomButton';

type RouteParams = {
  email: string;
};

const VerificationCodeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const [code, setCode] = useState(['', '', '', '', '']); // Soporta hasta 5 dígitos
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const inputRefs = useRef<TextInput[]>([]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return; // Solo permitir un dígito por input

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Limpiar mensaje de error cuando el usuario empiece a escribir
    if (errorMessage) setErrorMessage('');

    // Auto-focus al siguiente input (hasta 4, ya que el índice máximo es 4 para 5 dígitos)
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleValidateCode = async () => {
    const codeString = code.join('');

    if (codeString.length < 4 || codeString.length > 5) {
      setErrorMessage('Por favor ingresa un código válido de 4 o 5 dígitos');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await validateVerificationCode(email, codeString);

      if (response.status === true) {
        // El ID del usuario viene directamente en la respuesta de validateVerificationCode
        const userId = response.data?.id;
        if (userId) {
          navigation.navigate('ChangePassword', { email, userId });
        } else {
          setErrorMessage('No se pudo obtener el ID del usuario. Contacta al soporte.');
        }
      } else {
        setErrorMessage('Código inválido. Verifica e intenta nuevamente.');
      }
    } catch (error: any) {
      console.error('Error validating code:', error);
      setErrorMessage('Error al validar el código. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setErrorMessage(''); // Limpiar mensajes de error previos

      const response = await sendResetCode(email);

      if (response.status === true) {
        Alert.alert(
          'Código reenviado',
          'Se ha enviado un nuevo código de verificación a tu correo electrónico.',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert('Error', response.description || 'No se pudo reenviar el código.');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);

      // Manejar específicamente el error 503 del servicio externo
      if (error.message?.includes('503') || error.message?.includes('Servicio externo no disponible')) {
        Alert.alert(
          'Servicio temporalmente no disponible',
          'El servicio de envío de códigos está experimentando problemas técnicos. Por favor, intenta nuevamente en unos minutos.',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert('Error', 'No se pudo reenviar el código. Verifica tu conexión e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E1E50', '#3B82F6', '#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.decorativeCircle} />
        <View style={styles.decorativeCircleSmall} />
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🔢</Text>
          <Text style={styles.headerTitle}>Verificar Código</Text>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Ingresa el código</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código de 4 o 5 dígitos a{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <View style={styles.codeContainer}>
            {code.slice(0, 5).map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, errorMessage && styles.codeInputError]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                editable={!loading}
              />
            ))}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? 'Validando...' : 'Validar Código'}
              onPress={handleValidateCode}
            />
          </View>


          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Cambiar correo electrónico</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 180,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerIcon: {
    fontSize: 42,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -40,
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
    alignItems: 'center',
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
  emailText: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E50',
    backgroundColor: '#F8FAFC',
    shadowColor: '#1E1E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  resendText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -15,
    right: -15,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -10,
    left: -10,
  },
});

export default VerificationCodeScreen;