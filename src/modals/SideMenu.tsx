import React, { useEffect, useRef, useContext, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AuthContext } from '../context/AuthContext';
import { environment } from '../api/constant/Enviroment';
import { getRolesByUserId } from '../api/services/rolUserService';

const { width, height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type UserRole = {
  userId: number;
  nameUser: string;
  rolId: number;
  rolName: string;
  id: number;
  status: number;
};

const SideMenu = ({ visible, onClose, navigation }: Props) => {
  // Valor inicial para que se deslice desde la izquierda y se quede en la izquierda
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { logout, user, person } = useContext(AuthContext);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchUserRoles();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Se queda en la posición 0 (izquierda)
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width, // Se va hacia la izquierda
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const fetchUserRoles = async () => {
  if (!user?.id) return;

  try {
    setLoading(true);
    const roles = await getRolesByUserId(user.id);
    setUserRoles(roles);
  } catch (error) {
    console.error('Error al cargar roles:', error);
    setUserRoles([]);
  } finally {
    setLoading(false);
  }
};


  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
    onClose();
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: async () => {
            await logout();
            onClose();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Inicio' }],
            });
          },
        },
      ]
    );
  };

  const getFullName = () => {
    if (!person) return 'Usuario';
    const nameParts = [
      person.fisrtName,
      person.secondName,
      person.lastName,
      person.secondLastName,
    ].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(' ') : 'Usuario';
  };

  const getProfileImage = () => {
  const photo = user?.photo?.trim();

  // Si no hay foto, usar placeholder con inicial
  if (!photo) {
    const initial = (person?.fisrtName?.charAt(0) || 'U').toUpperCase();
    return `https://via.placeholder.com/120/6366f1/ffffff?text=${initial}`;
  }

  // Si es URL completa
  if (photo.startsWith('http')) {
    let url = photo;
    if (url.includes('localhost')) {
      url = url.replace('localhost', environment.uri);
    }
    return url;
  }

  // Si es solo nombre de archivo
  return `http://${environment.uri}:5250/usuarios/${photo}`;
};


  const getRoleName = () => {
    if (userRoles.length === 0) return 'Usuario';
    return userRoles.map(role => role.rolName).join(', ');
  };

  // Definir opciones del menú basadas en el rol del usuario
  const getMenuOptions = () => {
    const baseOptions = [
      { icon: 'home-outline', label: 'Inicio', screen: 'Main' as keyof RootStackParamList },
    ];

    // Si el usuario tiene rol de "Acudiente" (ID 4), mostrar agenda
    const isParent = userRoles.some(role => role.rolId === 4);
    if (isParent) {
      baseOptions.push(
        { icon: 'calendar-outline', label: 'Mi Agenda', screen: 'Agenda' as keyof RootStackParamList }
      );
    }

    return baseOptions;
  };

  const menuOptions = getMenuOptions();

  return (
    <Modal transparent visible={visible} animationType="none">
      <StatusBar backgroundColor="rgba(0,0,0,0.35)" barStyle="dark-content" />
      
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B6B8A" />
          </TouchableOpacity>

          {/* Perfil del usuario */}
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: getProfileImage() }}
                style={styles.profileImage}
              />
              <View style={styles.statusDot} />
            </View>
            
            <Text style={styles.profileName} numberOfLines={2}>
              {getFullName()}
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color="#6B6B8A" style={styles.roleLoader} />
            ) : (
              <Text style={styles.profileRole}>{getRoleName()}</Text>
            )}
          </View>

          {/* Opciones del menú */}
          <View style={styles.optionsContainer}>
            {menuOptions.map((option, index) => (
              <MenuOption
                key={index}
                icon={option.icon}
                label={option.label}
                onPress={() => handleNavigate(option.screen)}
              />
            ))}
          </View>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SchoolMe v1.0</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const MenuOption = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons name={icon as any} size={20} color="#1E1E50" style={styles.optionIcon} />
    <Text style={styles.optionText}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={styles.optionChevron} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  statusDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#6B6B8A',
    textAlign: 'center',
  },
  roleLoader: {
    marginTop: 4,
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#1E1E50',
    fontWeight: '500',
    flex: 1,
  },
  optionChevron: {
    marginLeft: 'auto',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    marginTop: 'auto',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default SideMenu;