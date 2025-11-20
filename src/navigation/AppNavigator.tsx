import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens de seguridad y flujo principal
import InicioScreen from '../screens/ModelSecurity/InicioScreen';
import LoginScreen from '../screens/ModelSecurity/LoginScreen';
import MainTabsScreen from '../screens/ModelSecurity/MainTabsScreen';

// Pantallas de recuperación de contraseña
import ForgotPasswordScreen from '../screens/ModelSecurity/ForgotPasswordScreen';
import VerificationCodeScreen from '../screens/ModelSecurity/VerificationCodeScreen';

// Otras pantallas
import AgendaScreen from '../screens/Business/AgendaScreen';
import ReportesScreen from '../screens/Business/ReportesScreen';


// Pantalla de editar perfil
import EditProfileScreen from '../screens/Parameters/EditProfileScreen';

// Pantalla de cambio de contraseña
import ChangePasswordScreen from '../screens/ModelSecurity/ChangePasswordScreen';

export type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
  Main: undefined;
  Agenda: undefined;
  Reportes: undefined;
  Padres: undefined;
  EditProfile: undefined; // Nueva ruta agregada
  ForgotPassword: undefined;
  VerificationCode: { email: string };
  ChangePassword: { email: string; userId?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={InicioScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabsScreen} />
      <Stack.Screen name="Agenda" component={AgendaScreen} />
      <Stack.Screen name="Reportes" component={ReportesScreen} />
      {/* Nueva pantalla de editar perfil */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false, // Usamos header personalizado
          presentation: 'card', // Animación suave
        }}
      />
      {/* Pantallas de recuperación de contraseña */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}