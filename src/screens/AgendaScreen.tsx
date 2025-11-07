import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { 
  getStudentCurrentAgenda,
  confirmAgendaReading 
} from '../api/services/agendaService';

const AgendaScreen = () => {
  const navigation = useNavigation();
  const { user, person } = useAuth();
  
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState<any>(null);
  const [agendaDay, setAgendaDay] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [parentComment, setParentComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Estados para animaciones
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    loadAgendaData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Animaciones de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const loadAgendaData = async () => {
    try {
      // Aquí deberías obtener el studentId basado en el usuario actual
      // Por ahora uso un ID de ejemplo - ajústalo según tu lógica
      const studentId = 1; // Esto debería venir de tu contexto o API
      
      const data = await getStudentCurrentAgenda(studentId);
      
      setAgenda(data.agenda);
      setAgendaDay(data.agendaDay);
      setGroup(data.group);
      setObservations(data.observations);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar la agenda');
      console.error('Error loading agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReading = async () => {
    if (!agendaDay) return;

    Alert.alert(
      'Confirmar Lectura',
      '¿Estás seguro de que deseas confirmar la lectura de esta agenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            try {
              setSubmitting(true);
              await confirmAgendaReading(agendaDay.id, parentComment);
              Alert.alert('Éxito', 'Lectura confirmada correctamente');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al confirmar la lectura');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const getAnswerColor = (answer: string) => {
    switch (answer.toLowerCase()) {
      case 'sí':
      case 'muy bien':
      case 'excelente':
        return '#10B981'; // Verde
      case 'no':
      case 'mal':
      case 'muy poco':
        return '#EF4444'; // Rojo
      case 'regular':
      case 'bien':
        return '#F59E0B'; // Amarillo
      default:
        return '#6B7280'; // Gris
    }
  };

  const getAnswerEmoji = (answer: string) => {
    switch (answer.toLowerCase()) {
      case 'sí': return '✅';
      case 'no': return '❌';
      case 'muy bien': return '😊';
      case 'bien': return '🙂';
      case 'regular': return '😐';
      case 'mal': return '😞';
      case 'muy poco': return '😔';
      default: return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1E1E50" />
        <LinearGradient
          colors={['#4C1D95', '#5B21B6', '#6366F1']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando agenda...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!agenda || !agendaDay || !group) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#4C1D95', '#5B21B6', '#6366F1']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agenda</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataEmoji}>📅</Text>
          <Text style={styles.noDataTitle}>Sin agenda disponible</Text>
          <Text style={styles.noDataText}>
            No hay agenda activa para hoy.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4C1D95" />
      
      {/* Header con gradiente */}
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
            <Text style={styles.headerTitle}>#{group.name}</Text>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => navigation.navigate('Main' as never)}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(agendaDay.openAt)}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Información de la agenda */}
          <View style={styles.agendaInfoCard}>
            <Text style={styles.agendaTitle}>{agenda.name}</Text>
            {agenda.description && (
              <Text style={styles.agendaDescription}>{agenda.description}</Text>
            )}
          </View>

          {/* Observaciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Observaciones del día</Text>
            
            {observations.map((obs, index) => (
              <Animated.View
                key={obs.id}
                style={[
                  styles.observationCard,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.observationHeader}>
                  <Text style={styles.observationEmoji}>
                    {getAnswerEmoji(obs.answer)}
                  </Text>
                  <Text style={styles.observationQuestion}>{obs.question}</Text>
                </View>
                
                <View style={[
                  styles.observationAnswer,
                  { borderLeftColor: getAnswerColor(obs.answer) }
                ]}>
                  <Text style={[
                    styles.observationAnswerText,
                    { color: getAnswerColor(obs.answer) }
                  ]}>
                    {obs.answer}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Tareas pendientes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Tareas para realizar</Text>
            <View style={styles.taskCard}>
              <Text style={styles.taskIcon}>📝</Text>
              <Text style={styles.taskText}>
                Traer cuaderno de matemáticas para la próxima clase
              </Text>
            </View>
          </View>

          {/* Comentario del padre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💬 Comentario del padre (opcional)</Text>
            <View style={styles.commentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe un comentario para el profesor..."
                placeholderTextColor="#9CA3AF"
                value={parentComment}
                onChangeText={setParentComment}
                multiline
                textAlignVertical="top"
                maxLength={300}
              />
              <Text style={styles.characterCount}>
                {parentComment.length}/300
              </Text>
            </View>
          </View>

          {/* Botón de confirmación */}
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirmReading}
            disabled={submitting}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.confirmButtonGradient}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.confirmIcon}>✓</Text>
                  <Text style={styles.confirmButtonText}>Confirmar lectura</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
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
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 36,
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  agendaInfoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  agendaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  agendaDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  observationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  observationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  observationEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  observationQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  observationAnswer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  observationAnswerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  taskText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  commentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commentInput: {
    padding: 16,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    borderRadius: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  confirmIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 30,
  },
});

export default AgendaScreen;