import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getPersonById } from '../../api/services/personService';
import { User } from '../../api/types/User';
import { PersonData } from '../../api/types/Person';
import { getUserById } from '../../api/services/UserService';
import { environment } from '../../api/constant/Enviroment';

const PerfilScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<User | null>(null);
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id && user?.personId) {
          const [userRes, personRes] = await Promise.all([
            getUserById(user.id),
            getPersonById(user.personId),
          ]);
          setUserData(userRes);
          setPersonData(personRes);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFullName = () => {
    if (!personData) return 'Usuario';
    return [
      personData.fisrtName,
      personData.secondName,
      personData.lastName,
      personData.secondLastName,
    ]
      .filter(Boolean)
      .join(' ');
  };

  const getProfileImageSource = () => {
  if (user?.photo && user.photo.startsWith('http')) {
    let url = user.photo;

    if (url.includes('localhost')) {
      // Reemplaza localhost por la IP definida en enviroment2
      url = url.replace('localhost', environment.uri);
    }

    return { uri: url };
  }

  // Placeholder si no hay foto
  const initial = (personData?.fisrtName?.charAt(0) || 'U').toUpperCase();
  return {
    uri: `https://via.placeholder.com/120/6366f1/ffffff?text=${initial}`
  };
};



  const getGenderText = () => {
    switch (personData?.gender) {
      case 1:
        return 'Femenino';
      case 2:
        return 'Masculino';
      case 3:
        return 'Otro';
      default:
        return 'No especificado';
    }
  };

  const getStatusColor = () => {
    return userData?.status === 1 ? '#10B981' : '#EF4444';
  };

  const getStatusText = () => {
    return userData?.status === 1 ? 'Activo' : 'Inactivo';
  };

  const handleEditProfile = () => {
    // @ts-ignore
    navigation.navigate('EditProfile');
  };

  if (loading || !userData || !personData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E50" />
      <LinearGradient
        colors={['#1E1E50', '#5B21B6', '#6366F1']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Perfil  </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <Image

                source={getProfileImageSource()}
                style={styles.profileImage}
                onError={(e) => {
                  console.log('Image load error:', e.nativeEvent?.error);
                  console.log('Trying URL:', (getProfileImageSource() as any)?.uri);
                }}
              />

            <View
              style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}
            />
          </View>
          <Text style={styles.fullName}>{getFullName()}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <InfoItem icon="email" label="Correo electrónico" value={userData.email} />
          <InfoItem
            icon="credit-card"
            label="Identificación"
            value={personData.identification}
          />
          <InfoItem
            icon="badge"
            label="Tipo de documento"
            value={personData.acronymDocument}
          />
          <InfoItem
            icon="phone"
            label="Teléfono"
            value={personData.phone || 'No disponible'}
          />
          <InfoItem icon="wc" label="Género" value={getGenderText()} />
          <InfoItem
            icon="flag"
            label="Ciudad"
            value={personData.munisipalityName || 'No especificada'}
          />
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Icon name="edit" size={20} color="#6366F1" />
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: any }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      <Icon name={icon} size={20} color="#6366F1" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);


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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  displayName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PerfilScreen;