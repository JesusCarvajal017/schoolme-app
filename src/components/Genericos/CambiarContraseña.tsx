import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../api/services/UserService';
import { resetPassword } from '../../api/services/authService';
import CustomInput from './CustomInput';

interface CambiarContraseñaProps {
  email: string;
  onSuccess?: () => void;
  isRecoveryMode?: boolean;
  userId?: number;
}

const CambiarContraseña: React.FC<CambiarContraseñaProps> = ({ email, onSuccess, isRecoveryMode = false, userId }) => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (isRecoveryMode) {
      // Modo recuperación: no requiere usuario autenticado, pero sí userId
      if (!userId) {
        Alert.alert('Error', 'ID de usuario no encontrado');
        return;
      }
    } else {
      // Modo normal: requiere usuario autenticado
      if (!user) {
        Alert.alert('Error', 'Usuario no encontrado');
        return;
      }
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    // Validar requisitos de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Error',
        'La contraseña debe tener:\n• Al menos 6 caracteres\n• Una letra mayúscula\n• Un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?/)'
      );
      return;
    }

    try {
      setLoading(true);

      if (isRecoveryMode && userId) {
        // Usar resetPassword para recuperación
        await resetPassword(userId, newPassword, confirmPassword);
      } else if (user) {
        // Usar changePassword normal
        await changePassword(user.id, newPassword, confirmPassword);
      }

      setNewPassword('');
      setConfirmPassword('');

      Alert.alert(
        '✅ ¡Contraseña actualizada!',
        'Tu contraseña se ha cambiado correctamente.',
        [{ text: 'Aceptar', style: 'default' }]
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nueva Contraseña</Text>
        <CustomInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 especial"
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
        <CustomInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repite la nueva contraseña"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.changePasswordButton, loading && styles.disabledButton]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <LinearGradient
          colors={['#4C1D95', '#5B21B6']}
          style={styles.changePasswordGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.changePasswordIcon}>🔑</Text>
              <Text style={styles.changePasswordText}>Actualizar Contraseña</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  changePasswordButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  changePasswordGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  changePasswordIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CambiarContraseña;