// src/api/services/agendaService.ts
import { Petitioner } from '../../util/fetchClass';
import { environment } from '../constant/Enviroment';
import {
  AttendantRelation,
  AgendaDayToday,
  AgendaQuestion,
  AgendaDayStudentRecord,
  StudentAnswersResponse,
  AgendaContext,
  AgendaDayStudent,
  StudentWithAgendaStatus,
  TeacherObservation,
  TeacherObservationDetail
} from '../types/Agenda';

const http = new Petitioner();
const baseUrl = environment.urlApi;



/**
 * 1. Obtener estudiantes del acudiente
 * GET /api/Attendants/Relation?status=1&personId={personId}
 */
export async function getAttendantRelations(attendantPersonId: number): Promise<AttendantRelation[]> {
  try {
    console.log(' Obteniendo estudiantes del acudiente:', attendantPersonId);
    const relations = await http.querys<AttendantRelation[]>(
      `${baseUrl}/Attendants/Relation?status=1&personId=${attendantPersonId}`
    );
    console.log(' Estudiantes obtenidos:', relations.length);
    return relations;
  } catch (error) {
    console.error(' Error al obtener estudiantes:', error);
    throw new Error('No se pudieron obtener los estudiantes asociados');
  }
}


/**
 * 3. Obtener agendas del día
 * GET /api/AgendaDay/Today
 */
export async function getAgendaDayToday(): Promise<AgendaDayToday[]> {
  try {
    console.log(' Obteniendo agendas del día...');
    const agendaDays = await http.querys<AgendaDayToday[]>(
      `${baseUrl}/AgendaDay/Today`
    );
    console.log(' Agendas obtenidas:', agendaDays.length);
    return agendaDays;
  } catch (error) {
    console.error(' Error al obtener agendas:', error);
    throw new Error('No se pudo obtener la agenda del día');
  }
}

/**
 * 4. Obtener preguntas de la agenda
 * GET /api/CompsitionAgenda/{agendaId}/questions
 */
export async function getAgendaQuestions(agendaId: number): Promise<AgendaQuestion[]> {
  try {
    console.log(' Obteniendo preguntas:', agendaId);
    const questions = await http.querys<AgendaQuestion[]>(
      `${baseUrl}/CompsitionAgenda/${agendaId}/questions`
    );
    console.log(' Preguntas obtenidas:', questions.length);
    return questions;
  } catch (error) {
    console.error(' Error al obtener preguntas:', error);
    throw new Error('No se pudieron obtener las preguntas');
  }
}

/**
 * 5. Obtener estudiantes vinculados a agenda
 * GET /api/AgendaDayStudent/by-agenda-day/{agendaDayId}
 */
export async function getAgendaDayStudents(agendaDayId: number): Promise<AgendaDayStudentRecord[]> {
  try {
    console.log(' Obteniendo estudiantes de agenda:', agendaDayId);
    const students = await http.querys<AgendaDayStudentRecord[]>(
      `${baseUrl}/AgendaDayStudent/by-agenda-day/${agendaDayId}`
    );
    console.log(' Estudiantes de agenda:', students.length);
    return students;
  } catch (error) {
    console.error(' Error al obtener estudiantes de agenda:', error);
    throw new Error('No se pudieron obtener los estudiantes de la agenda');
  }
}

/**
 * 6. Verificar confirmaciones
 * GET /api/AgendaDayStudent/Confirmations/Student/{studentId}
 */
export async function getStudentConfirmations(studentId: number): Promise<AgendaDayStudent[]> {
  try {
    console.log(' Verificando confirmaciones:', studentId);
    const confirmations = await http.querys<AgendaDayStudent[]>(
      `${baseUrl}/AgendaDayStudent/Confirmations/Student/${studentId}`
    );
    console.log(' Confirmaciones:', confirmations.length);
    return confirmations;
  } catch (error) {
    console.error(' Error al verificar confirmaciones:', error);
    return [];
  }
}

/**
 * 7. Obtener respuestas del estudiante
 * GET /api/StudentAnsware/{agendaDayStudentId}/answers
 */
export async function getStudentAnswers(agendaDayStudentId: number): Promise<StudentAnswersResponse> {
  try {
    console.log(' Obteniendo respuestas:', agendaDayStudentId);
    const answers = await http.querys<StudentAnswersResponse>(
      `${baseUrl}/StudentAnsware/${agendaDayStudentId}/answers`
    );
    console.log(' Respuestas obtenidas');
    return answers;
  } catch (error) {
    console.error(' No hay respuestas registradas');
    throw error;
  }
}

/**
 * 8. Observaciones de profesores
 * GET /api/TeacherObservation/ByAgendaDayStudent/{agendaDayStudentId}
 */
export async function getTeacherObservations(agendaDayStudentId: number): Promise<TeacherObservation[]> {
  try {
    console.log(' Obteniendo observaciones de profesores:', agendaDayStudentId);
    const observations = await http.querys<TeacherObservation[]>(
      `${baseUrl}/TeacherObservation/ByAgendaDayStudent/${agendaDayStudentId}`
    );
    console.log(' Observaciones encontradas:', observations.length);
    return observations;
  } catch (error) {
    console.error(' Error al obtener observaciones:', error);
    return [];
  }
}

/**
 * 9. Confirmar agenda
 * PATCH /api/AgendaDayStudent/partial/{agendaDayStudentId}
 */
export async function confirmAgenda(
  agendaDayStudentId: number,
  agendaDayId: number,
  studentId: number
): Promise<void> {
  try {
    console.log(' Confirmando agenda:', agendaDayStudentId);
    
    const payload = {
      id: agendaDayStudentId,
      status: 1,
      agendaDayId: agendaDayId,
      studentId: studentId,
      agendaDayStudentStatus: 1,
      completedAt: new Date().toISOString()
    };

    await http.command(
      `${baseUrl}/AgendaDayStudent/partial/${agendaDayStudentId}`,
      payload,
      "PATCH"
    );

    console.log(' Agenda confirmada exitosamente');
  } catch (error: any) {
    console.error(' Error al confirmar:', error);
    
    if (error.message?.includes('409')) {
      throw new Error('Ya has confirmado esta agenda');
    } else if (error.message?.includes('403')) {
      throw new Error('No tienes permisos');
    } else if (error.message?.includes('404')) {
      throw new Error('Agenda no disponible');
    }
    
    throw new Error('No se pudo confirmar la agenda');
  }
}

// ==================== FUNCIONES COMPUESTAS ====================

/**
 * Contexto completo de agenda
 */
export async function getStudentAgendaContext(
  studentId: number,
  attendantPersonId: number
): Promise<AgendaContext> {
  try {
    console.log(' Cargando contexto completo...');
    
    // 1. Verificar relación
    const relations = await getAttendantRelations(attendantPersonId);
    const studentRelation = relations.find(r => r.studentId === studentId);
    
    if (!studentRelation) {
      throw new Error('Estudiante no asociado a tu cuenta');
    }

    // 2. Agenda del día
    const agendaDays = await getAgendaDayToday();
    const studentAgendaDay = agendaDays.find(day => day.groupId !== undefined);

    if (!studentAgendaDay) {
      throw new Error('No hay agenda activa para hoy');
    }

    // 4. Preguntas
    const questions = await getAgendaQuestions(studentAgendaDay.agendaId);

    // 5. Registro del estudiante
    const agendaDayStudents = await getAgendaDayStudents(studentAgendaDay.agendaDayId);
    const studentRecord = agendaDayStudents.find(s => s.studentId === studentId);

    if (!studentRecord) {
      throw new Error('Estudiante no registrado en esta agenda');
    }

    // 6. Verificar confirmación
    const confirmations = await getStudentConfirmations(studentId);
    const isCompleted = confirmations.some(
      c => c.agendaDayStudentStatus === 1 && 
           c.agendaDayId === studentAgendaDay.agendaDayId
    );

    // 7. Obtener respuestas
    let studentAnswers = null;
    try {
      studentAnswers = await getStudentAnswers(studentRecord.agendaDayStudentId);
    } catch (error) {
      console.log(' Sin respuestas aún');
    }

    const teacherObservations = await getTeacherObservations(studentRecord.agendaDayStudentId);

    console.log(' Contexto cargado completamente');

    return {
      student: studentRelation,
      agendaDay: studentAgendaDay,
      agendaDayStudentRecord: studentRecord,
      questions,
      studentAnswers,
      teacherObservations,
      isCompleted
    };

  } catch (error: any) {
    console.error(' Error al cargar contexto:', error);
    throw error;
  }
}

/**
 * Estudiantes con estado de agenda
 */
export async function getStudentsWithAgendaStatus(
  attendantPersonId: number
): Promise<StudentWithAgendaStatus[]> {
  try {
    console.log(' Obteniendo estados de agenda...');

    const relations = await getAttendantRelations(attendantPersonId);
    const agendaDays = await getAgendaDayToday();

    // Obtener todos los registros de estudiantes en agendas del día
    const allAgendaDayStudents = await Promise.all(
      agendaDays.map(day => getAgendaDayStudents(day.agendaDayId))
    );
    const studentsWithAgenda = new Set(
      allAgendaDayStudents.flat().map(record => record.studentId)
    );

    const studentsWithStatus = await Promise.all(
      relations.map(async (student): Promise<StudentWithAgendaStatus> => {
        // Verificar si el estudiante tiene agenda hoy
        const hasAgendaToday = studentsWithAgenda.has(student.studentId);

        if (!hasAgendaToday) {
          return {
            ...student,
            agendaStatus: 'no-agenda' as const
          };
        }

        const confirmations = await getStudentConfirmations(student.studentId);
        const todayAgenda = agendaDays.find(day =>
          allAgendaDayStudents.flat().some(record =>
            record.studentId === student.studentId && record.agendaId === day.agendaId
          )
        );

        const isCompleted = confirmations.some(
          c => c.agendaDayStudentStatus === 1 &&
               c.agendaDayId === todayAgenda?.agendaDayId
        );

        return {
          ...student,
          agendaStatus: isCompleted ? 'completed' as const : 'pending' as const
        };
      })
    );

    console.log(' Estados obtenidos');
    return studentsWithStatus;

  } catch (error) {
    console.error(' Error al obtener estados:', error);
    throw new Error('No se pudo obtener el estado de las agendas');
  }
}
