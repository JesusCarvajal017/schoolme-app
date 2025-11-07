import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/services/UserService';

const AjustesScreen = () => {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user) return;

    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await changePassword(user.id, newPassword, confirmPassword);
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);

      Alert.alert(
        '✅ ¡Contraseña actualizada!',
        'Tu contraseña se ha cambiado correctamente.',
        [{ text: 'Aceptar', style: 'default' }]
      );
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleAboutApp = () => {
    Alert.alert(
      'Acerca de SchoolMe',
      'Versión 1.0.0\n\nEsta es la versión inicial de SchoolMe que incluye funcionalidades básicas de gestión escolar. Próximamente se agregarán más características.',
      [{ text: 'Entendido' }]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E50" />
      <LinearGradient colors={['#1E1E50', '#5B21B6', '#6366F1']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Ajustes    </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Cuenta</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>🔒</Text>
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Cambiar Contraseña</Text>
              <Text style={styles.settingDescription}>
                Actualiza tu contraseña de acceso
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Información</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleAboutApp}>
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>📱</Text>
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Acerca de la App</Text>
              <Text style={styles.settingDescription}>
                Versión 1.0.0 - Información de la aplicación
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Estado del proyecto */}
        <View style={styles.noticeContainer}>
          <View style={styles.noticeHeader}>
            <Text style={styles.noticeIcon}>📢</Text>
            <Text style={styles.noticeTitle}>Estado del Proyecto</Text>
          </View>
          <View style={styles.noticeBorder}>
            <Text style={styles.noticeText}>
              Esta versión de SchoolMe incluye las funcionalidades básicas para la gestión escolar:
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• Gestión de perfil de usuario</Text>
              <Text style={styles.featureItem}>• Visualización de agenda diaria</Text>
              <Text style={styles.featureItem}>• Cambio de contraseña</Text>
              <Text style={styles.featureItem}>• Configuraciones básicas</Text>
            </View>
            <Text style={styles.futureText}>
              🚀 Próximamente se agregarán más funcionalidades como reportes avanzados, 
              comunicación con profesores, calendario de actividades y mucho más.
            </Text>
          </View>
        </View>

        {/* Sesión */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚪 Sesión</Text>
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>🔓</Text>
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, styles.logoutText]}>Cerrar Sesión</Text>
              <Text style={styles.settingDescription}>Salir de tu cuenta actual</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modal cambiar contraseña */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔐 Cambiar Contraseña</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  editable={!loading}
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
                      <Text style={styles.changePasswordText}>Cambiar Contraseña</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


            
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F8FAFC',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  logoutItem: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
  },
  logoutText: {
    color: '#DC2626',
  },
  noticeContainer: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  noticeBorder: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  noticeText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 24,
  },
  futureText: {
    fontSize: 14,
    color: '#6366F1',
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  modalContent: {
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
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
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

export default AjustesScreen;