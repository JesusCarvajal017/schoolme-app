import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { updateUserEmail } from '../api/services/UserService';
import { getPersonById } from '../api/services/personService';
import { PersonData } from '../api/types';
const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUserData, updateUserEmailInContext } = useAuth();

  const [loading, setLoading] = useState(false);
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchPersonData();
    }
  }, [user]);

  const fetchPersonData = async () => {
    try {
      if (user?.personId) {
        const data = await getPersonById(user.personId);
        setPersonData(data);
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos completos del perfil');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveBasicInfo = async () => {
    if (!user) return;

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);

      if (email !== user.email) {
        // Actualiza en backend
        await updateUserEmail(user.id, email, user.personId, user.status);
        // Sincroniza contexto y AsyncStorage
        await updateUserEmailInContext(email);
        // Actualiza estado local
        setEmail(email);
      }

      await refreshUserData();

      Alert.alert(
        '✅ ¡Perfil actualizado!',
        'Tus cambios se han guardado con éxito y ya están disponibles.',
        [{ text: 'Aceptar', style: 'default' }]
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !personData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E1E50" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={['#1E1E50', '#5B21B6', '#6366F1']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Email editable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Correo Electrónico</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSaveBasicInfo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.saveIcon}>💾</Text>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Información no editable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <Text style={styles.sectionDescription}>
            Esta información no puede ser modificada
          </Text>
          <View style={styles.readOnlyInfo}>
            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>NOMBRE COMPLETO</Text>
              <Text style={styles.readOnlyValue}>
                {`${personData.fisrtName || ''} ${personData.secondName || ''} ${personData.lastName || ''} ${personData.secondLastName || ''}`.trim()}
              </Text>
            </View>
            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>IDENTIFICACIÓN</Text>
              <Text style={styles.readOnlyValue}>{personData.identification}</Text>
            </View>
            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>TIPO DE DOCUMENTO</Text>
              <Text style={styles.readOnlyValue}>
                {personData.acronymDocument || 'No especificado'}
              </Text>
            </View>
            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>TELÉFONO</Text>
              <Text style={styles.readOnlyValue}>
                {personData.phone || 'No especificado'}
              </Text>
            </View>
            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>GÉNERO</Text>
              <Text style={styles.readOnlyValue}>
                {personData.gender === 1
                  ? 'Femenino'
                  : personData.gender === 2
                  ? 'Masculino'
                  : 'Otro'}
              </Text>
            </View>
            {personData.rhName && (
              <View style={styles.readOnlyItem}>
                <Text style={styles.readOnlyLabel}>GRUPO SANGUÍNEO</Text>
                <Text style={styles.readOnlyValue}>{personData.rhName}</Text>
              </View>
            )}
            {personData.adress && (
              <View style={styles.readOnlyItem}>
                <Text style={styles.readOnlyLabel}>DIRECCIÓN</Text>
                <Text style={styles.readOnlyValue}>{personData.adress}</Text>
              </View>
            )}
            {personData.brithDate && (
              <View style={styles.readOnlyItem}>
                <Text style={styles.readOnlyLabel}>FECHA DE NACIMIENTO</Text>
                <Text style={styles.readOnlyValue}>
                  {new Date(personData.brithDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            {personData.epsName && (
              <View style={styles.readOnlyItem}>
                <Text style={styles.readOnlyLabel}>EPS</Text>
                <Text style={styles.readOnlyValue}>{personData.epsName}</Text>
              </View>
            )}
            {personData.munisipalityName && (
              <View style={styles.readOnlyItem}>
                <Text style={styles.readOnlyLabel}>MUNICIPIO</Text>
                <Text style={styles.readOnlyValue}>{personData.munisipalityName}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  saveIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  readOnlyInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  readOnlyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  readOnlyLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default EditProfileScreen;

function updateUserEmailInContext(email: string) {
  throw new Error('Function not implemented.');
}
