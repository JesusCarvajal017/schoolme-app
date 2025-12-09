import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentAgendaContext,
  confirmAgenda
} from '../../api/services/agendaService';
import { AgendaContext, StudentAnswer, AgendaQuestion } from '../../api/types/Agenda';

const AgendaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { person } = useAuth();

  const { studentId, studentName } = (route.params as any) || {};

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [agendaContext, setAgendaContext] = useState<AgendaContext | null>(null);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    loadAgendaData();
  }, []);

  useEffect(() => {
    if (!loading && agendaContext) {
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
  }, [loading, agendaContext]);

  const loadAgendaData = async () => {
    try {
      if (!studentId || !person?.id) {
        throw new Error('Información del estudiante no disponible');
      }
      const context = await getStudentAgendaContext(studentId, person.id);
      setAgendaContext(context);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar la agenda');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAgenda = async () => {
    if (!agendaContext) return;

    if (agendaContext.isCompleted) {
      Alert.alert('Información', 'Esta agenda ya fue confirmada anteriormente');
      return;
    }

    Alert.alert(
      'Confirmar Agenda',
      'Has leído toda la información de la agenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: async () => {
            try {
              setConfirming(true);

              await confirmAgenda(
                agendaContext.agendaDayStudentRecord.agendaDayStudentId,
                agendaContext.agendaDay.agendaDayId,
                agendaContext.student.studentId
              );

              setAgendaContext({
                ...agendaContext,
                isCompleted: true
              });

              Alert.alert('Exitoso', 'Agenda confirmada correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al confirmar la agenda');
            } finally {
              setConfirming(false);
            }
          }
        }
      ]
    );
  };

  const getAnswerValue = (answer: StudentAnswer, question: AgendaQuestion): string => {
    if (answer.valueBool !== null) return answer.valueBool ? 'Sí' : 'No';
    if (answer.valueText !== null) return answer.valueText;
    if (answer.valueDate !== null) {
      const date = new Date(answer.valueDate);
      return date.toLocaleDateString('es-ES');
    }
    if (answer.valueNumber !== null) return answer.valueNumber.toString();

    if (answer.optionIds && answer.optionIds.length > 0) {
      const selectedOptions = question.options
        .filter(opt => answer.optionIds.includes(opt.id))
        .map(opt => opt.text);
      return selectedOptions.join(', ');
    }
    return 'Sin respuesta';
  };

  const getAnswerColor = (answer: StudentAnswer): string => {
    if (answer.valueBool !== null) return answer.valueBool ? '#10B981' : '#EF4444';
    if (answer.valueText !== null && answer.valueText.length > 0) return '#6366F1';
    return '#6B7280';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1E1E50" />
        <LinearGradient colors={['#4C1D95', '#5B21B6', '#6366F1']} style={styles.loadingGradient}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando agenda...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!agendaContext) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataEmoji}>📅</Text>
          <Text style={styles.noDataTitle}>No hay agenda pendiente</Text>
          <Text style={styles.noDataText}>
            No tienes agendas pendientes para confirmar en este momento.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4C1D95" />

      {/* HEADER */}
      <LinearGradient colors={['#1E1E50', '#5B21B6', '#6366F1']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>salir</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {studentName || agendaContext.student.nameStudent}
            </Text>

            <View style={styles.placeholder} />
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(
                agendaContext.lastUpdateDate ||
                agendaContext.agendaDayStudentRecord?.date ||
                agendaContext.agendaDay.date
              )}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* CONTENT */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* ESTADO */}
          {agendaContext.isCompleted && (
            <View style={styles.completedBanner}>
              <View style={styles.completedTextContainer}>
                <Text style={styles.completedTitle}>Agenda Confirmada</Text>
                <Text style={styles.completedSubtitle}>
                  Ya has confirmado que leíste esta agenda
                </Text>
              </View>
            </View>
          )}

          {/* INFORMACIÓN */}
          <View style={styles.agendaInfoCard}>
            <Text style={styles.agendaTitle}>{agendaContext.agendaDay.agendaName}</Text>
            <Text style={styles.infoText}>{agendaContext.agendaDay.groupName}</Text>
          </View>

          {/* RESPUESTAS */}
          {(agendaContext.studentAnswers?.answers?.length ?? 0) > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Día</Text>

              {agendaContext.studentAnswers?.answers?.map((answer) => {
                const question = agendaContext.questions.find(q => q.id === answer.questionId);
                if (!question) return null;

                return (
                  <View key={answer.id} style={styles.answerCard}>
                    <Text style={styles.questionText}>{question.text}</Text>
                    <View style={[styles.answerValue, { borderLeftColor: getAnswerColor(answer) }]}>
                      <Text style={[styles.answerValueText, { color: getAnswerColor(answer) }]}>
                        {getAnswerValue(answer, question)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* REPORTES DE LOS DOCENTES */}
          {agendaContext.teacherObservations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reportes de los docentes</Text>

              {agendaContext.teacherObservations.map((obs) => (
                <View key={obs.id} style={styles.observationCard}>
                  <View style={styles.observationHeader}>
                    <Text style={styles.observationSubject}>{obs.subjectName}</Text>
                    <Text style={styles.observationTeacher}>{obs.teacherName}</Text>
                  </View>

                  <Text style={styles.observationText}>{obs.text}</Text>

                  <View style={styles.observationFooter}>
                    <Text style={styles.observationMeta}>Grado: {obs.gradeName}</Text>
                    <Text style={styles.observationMeta}>Grupo: {obs.groupName}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* CONFIRMAR */}
          {!agendaContext.isCompleted && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmAgenda}
              disabled={confirming}
            >
              <LinearGradient colors={['#10B981', '#059669']} style={styles.confirmButtonGradient}>
                {confirming ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmar lectura de la agenda</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

/* ============================
   ESTILOS
============================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1 },
  loadingGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  header: { paddingBottom: 20 },
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
  backIcon: { fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  placeholder: { width: 36 },
  dateContainer: { alignItems: 'center', marginTop: 12 },
  dateText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textTransform: 'capitalize' },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F8FAFC',
  },
  scrollView: { flex: 1 },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  completedTextContainer: { flex: 1 },
  completedTitle: { fontSize: 16, fontWeight: '700', color: '#065F46', marginBottom: 2 },
  completedSubtitle: { fontSize: 12, color: '#059669' },
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
  agendaTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  infoText: { fontSize: 14, color: '#6B7280' },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  answerCard: {
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
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  answerValue: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  answerValueText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  noAnswersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noAnswersEmoji: { fontSize: 48, marginBottom: 16 },
  noAnswersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noAnswersText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  confirmButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoBoxEmoji: { fontSize: 20, marginRight: 12 },
  infoBoxText: { fontSize: 14, color: '#1E40AF', flex: 1, lineHeight: 20 },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataEmoji: { fontSize: 64, marginBottom: 16 },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataText: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  bottomPadding: { height: 30 },
  /* NUEVOS ESTILOS PARA REPORTES */
  observationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  observationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  observationSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  observationTeacher: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4B5563',
  },
  observationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  observationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  observationMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default AgendaScreen;
