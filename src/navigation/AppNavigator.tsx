import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens de seguridad y flujo principal
import InicioScreen from '../screens/ModelSecurity/InicioScreen';
import LoginScreen from '../screens/ModelSecurity/LoginScreen';
import MainTabsScreen from '../screens/ModelSecurity/MainTabsScreen';

// Otras pantallas
import AgendaScreen from '../screens/AgendaScreen';
import ReportesScreen from '../screens/ReportesScreen';
import PadresScreen from '../screens/PadresScreen';

// Pantalla de editar perfil
import EditProfileScreen from '../screens/EditProfileScreen';

export type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
  Main: undefined;
  Agenda: undefined;
  Reportes: undefined;
  Padres: undefined;
  EditProfile: undefined; // Nueva ruta agregada
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
      <Stack.Screen name="Padres" component={PadresScreen} />
      {/* Nueva pantalla de editar perfil */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          headerShown: false, // Usamos header personalizado
          presentation: 'card', // Animación suave
        }}
      />
    </Stack.Navigator>
  );
}