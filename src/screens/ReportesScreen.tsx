// src/screens/AgendaScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AgendaScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>📅 Pantalla de Agenda</Text>
  </View>
);

export default AgendaScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E50' },
  text: { color: '#fff', fontSize: 18 },
});
