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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getStudentsWithAgendaStatus } from '../../api/services/agendaService';
import { StudentWithAgendaStatus } from '../../api/types/Agenda';

const MisHijosScreen = () => {
  const navigation = useNavigation();
  const { person } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState<StudentWithAgendaStatus[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Auto-navegar si solo hay un estudiante
    if (!loading && !refreshing && students.length === 1) {
      setTimeout(() => {
        handleStudentSelect(students[0]);
      }, 300);
    }
  }, [loading, students]);

  const loadStudents = async () => {
    try {
      if (!person?.id) {
        throw new Error('Usuario no autenticado');
      }

      const studentsWithStatus = await getStudentsWithAgendaStatus(person.id);
      setStudents(studentsWithStatus);

    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los estudiantes');
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  const handleStudentSelect = (student: StudentWithAgendaStatus) => {
    if (student.agendaStatus === 'no-agenda') {
      Alert.alert(
        'Sin agenda',
        `${student.nameStudent} no tiene agenda activa para hoy.`,
        [{ text: 'Entendido' }]
      );
      return;
    }

    try {
      (navigation as any).navigate('Agenda', {
        studentId: student.studentId,
        studentName: student.nameStudent
      });
    } catch (error) {
      console.error('Error navegando:', error);
      Alert.alert('Error', 'No se pudo abrir la agenda');
    }
  };

  const getStatusConfig = (status: 'completed' | 'pending' | 'no-agenda') => {
    switch (status) {
      case 'completed':
        return { emoji: '✅', text: 'Confirmada', color: '#10B981' };
      case 'pending':
        return { emoji: '📝', text: 'Pendiente', color: '#F59E0B' };
      case 'no-agenda':
        return { emoji: '📅', text: 'Sin agenda', color: '#6B7280' };
    }
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
          <Text style={styles.loadingText}>Cargando estudiantes...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4C1D95" />

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
            <Text style={styles.headerTitle}>Mis Hijos</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
              {students.length} {students.length === 1 ? 'estudiante' : 'estudiantes'} a tu cargo
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        {students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>No hay estudiantes</Text>
            <Text style={styles.emptyText}>
              No tienes estudiantes asociados en este momento.
            </Text>
          </View>
        ) : (
          <View style={styles.studentsContainer}>
            {students.map((student) => {
              const statusConfig = getStatusConfig(student.agendaStatus);
              
              return (
                <TouchableOpacity
                  key={student.studentId}
                  style={styles.studentCard}
                  onPress={() => handleStudentSelect(student)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FAFC']}
                    style={styles.studentCardGradient}
                  >
                    <View style={styles.studentMainInfo}>
                      <View style={styles.studentAvatar}>
                        <Text style={styles.studentInitial}>
                          {student.nameStudent.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.studentDetails}>
                        <Text style={styles.studentName}>
                          {student.nameStudent}
                        </Text>
                        
                        {student.academicInfo ? (
                          <>
                            <Text style={styles.studentGrade}>
                              {student.academicInfo.grade} - {student.academicInfo.group}
                            </Text>
                            <Text style={styles.studentTeacher}>
                              👨‍🏫 {student.academicInfo.teacher.name}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.studentId}>
                            {student.acronymDocument}: {student.document}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.statusSection}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusConfig.color}15` }
                      ]}>
                        <Text style={styles.statusEmoji}>
                          {statusConfig.emoji}
                        </Text>
                        <Text style={[
                          styles.statusText,
                          { color: statusConfig.color }
                        ]}>
                          {statusConfig.text}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.arrowContainer}>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  placeholder: {
    width: 36,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  studentsContainer: {
    padding: 20,
    gap: 16,
  },
  studentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentCardGradient: {
    padding: 20,
  },
  studentMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 2,
  },
  studentTeacher: {
    fontSize: 13,
    color: '#6B7280',
  },
  studentId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusSection: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrowContainer: {
    alignItems: 'flex-end',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});

export default MisHijosScreen;