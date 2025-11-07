import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, Image,
  ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { environment } from '../api/constant/Enviroment';
import { useAuth } from '../context/AuthContext';
import { uploadUserPhoto } from '../api/services/UserService';

type Props = { visible: boolean; onClose: () => void; };

const ChangePhotoModal = ({ visible, onClose }: Props) => {
  const { user, updateUserPhoto } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Debes permitir acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !user) return;
    try {
      setLoading(true);
      const ok = await uploadUserPhoto(user.id, imageUri);
      if (ok) {
        const newPhoto = imageUri; // o `${user.photo}?t=${Date.now()}` si backend devuelve nombre
        await updateUserPhoto(newPhoto);
        Alert.alert('Éxito', 'Foto de perfil actualizada.');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la foto.');
      }
      onClose();
    } catch (err) {
      console.error('Error al subir imagen:', err);
      Alert.alert('Error', 'No se pudo actualizar la foto.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPhoto = () => {
    if (imageUri) return { uri: imageUri };
    if (user?.photo?.startsWith('http')) return { uri: user.photo };
    if (user?.photo) return { uri: `http://${environment.uri}:5250/usuarios/${user.photo}` };
    return require('../assets/default.jpg');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Cambiar foto de perfil</Text>

          <Image source={getCurrentPhoto()} style={styles.preview} />

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Seleccionar imagen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#10B981' }]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePhotoModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '85%', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1E1E50' },
  preview: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, backgroundColor: '#eee' },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '600', marginLeft: 8 },
  cancel: { marginTop: 8 },
  cancelText: { color: '#EF4444', fontWeight: '500' },
});
