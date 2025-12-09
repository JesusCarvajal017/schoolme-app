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
 */
export async function getAttendantRelations(attendantPersonId: number) {
  try {
    return await http.querys<AttendantRelation[]>(
      `${baseUrl}/Attendants/Relation?status=1&personId=${attendantPersonId}`
    );
  } catch (error) {
    throw new Error('No se pudieron obtener los estudiantes asociados');
  }
}

/**
 * 2. Obtener agendas del día
 */
export async function getAgendaDayToday(): Promise<AgendaDayToday[]> {
  try {
    return await http.querys<AgendaDayToday[]>(`${baseUrl}/AgendaDay/Today`);
  } catch {
    throw new Error('No se pudo obtener la agenda del día');
  }
}

/**
 * 3. Obtener preguntas de agenda
 */
export async function getAgendaQuestions(agendaId: number) {
  try {
    return await http.querys<AgendaQuestion[]>(
      `${baseUrl}/CompsitionAgenda/${agendaId}/questions`
    );
  } catch {
    throw new Error('No se pudieron obtener las preguntas');
  }
}

/**
 * 4. Obtener estudiantes registrados en agenda
 */
export async function getAgendaDayStudents(agendaDayId: number) {
  try {
    return await http.querys<AgendaDayStudentRecord[]>(
      `${baseUrl}/AgendaDayStudent/by-agenda-day/${agendaDayId}`
    );
  } catch {
    throw new Error('No se pudieron obtener los estudiantes de la agenda');
  }
}

/**
 * 5. Obtener confirmaciones del estudiante
 */
export async function getStudentConfirmations(studentId: number) {
  try {
    return await http.querys<AgendaDayStudent[]>(
      `${baseUrl}/AgendaDayStudent/Confirmations/Student/${studentId}`
    );
  } catch {
    return [];
  }
}

/**
 * 6. Obtener fecha real (actualizada) desde Confirmations
 */
export async function getStudentAgendaLastUpdate(studentId: number): Promise<string | null> {
  try {
    const confirmations = await getStudentConfirmations(studentId);
    if (confirmations.length > 0) return confirmations[0].date;
    return null;
  } catch {
    return null;
  }
}

/**
 * 7. Obtener respuestas del estudiante
 */
export async function getStudentAnswers(agendaDayStudentId: number) {
  try {
    return await http.querys<StudentAnswersResponse>(
      `${baseUrl}/StudentAnsware/${agendaDayStudentId}/answers`
    );
  } catch {
    throw new Error('No hay respuestas registradas');
  }
}

/**
 * 8. Observaciones
 */
export async function getTeacherObservations(agendaDayStudentId: number) {
  try {
    const observations = await http.querys<TeacherObservation[]>(
      `${baseUrl}/TeacherObservation/ByAgendaDayStudent/${agendaDayStudentId}`
    );

    // Eliminar duplicados basados en el texto del reporte
    const uniqueObservations = observations.filter((obs, index, self) =>
      index === self.findIndex(o => o.text === obs.text)
    );

    return uniqueObservations;
  } catch {
    return [];
  }
}

/**
 * 9. Confirmar agenda
 */
export async function confirmAgenda(
  agendaDayStudentId: number,
  agendaDayId: number,
  studentId: number
) {
  const payload = {
    id: agendaDayStudentId,
    status: 3
  };

  try {
    await http.command(
      `${baseUrl}/AgendaDayStudent/partial/${agendaDayStudentId}`,
      payload,
      "PATCH"
    );
  } catch (error: any) {
    throw new Error('No se pudo confirmar la agenda');
  }
}


export async function getStudentAgendaContext(
  studentId: number,
  attendantPersonId: number
): Promise<AgendaContext> {
  try {
    const relations = await getAttendantRelations(attendantPersonId);
    const studentRelation = relations.find(r => r.studentId === studentId);
    if (!studentRelation) throw new Error('Estudiante no asociado');

    const agendaDays = await getAgendaDayToday();
    const agendaDay = agendaDays.find(day => day.groupId !== undefined);
    if (!agendaDay) throw new Error('No hay agenda activa');

    const questions = await getAgendaQuestions(agendaDay.agendaId);

    const students = await getAgendaDayStudents(agendaDay.agendaDayId);
    const studentRecord = students.find(s => s.studentId === studentId);
    if (!studentRecord) throw new Error('Estudiante no registrado en agenda');

    const confirmations = await getStudentConfirmations(studentId);
    const hasPendingConfirmation = confirmations.some(
      c => c.agendaDayId === agendaDay.agendaDayId &&
           c.status === 1
    );

    if (!hasPendingConfirmation) {
      throw new Error('No hay agenda pendiente para confirmar');
    }

    const isCompleted = confirmations.some(
      c => c.agendaDayId === agendaDay.agendaDayId &&
           c.agendaDayStudentStatus === 1
    );

    let studentAnswers = null;
    try {
      studentAnswers = await getStudentAnswers(studentRecord.agendaDayStudentId);
    } catch {}

    const teacherObservations = await getTeacherObservations(studentRecord.agendaDayStudentId);

    const lastUpdateDate = await getStudentAgendaLastUpdate(studentId);

    return {
      student: studentRelation,
      agendaDay,
      agendaDayStudentRecord: studentRecord,
      questions,
      studentAnswers,
      teacherObservations,
      isCompleted,
      lastUpdateDate
    };

  } catch (error) {
    throw error;
  }
}

/**
 * 11. Estado de agenda por estudiante
 */
export async function getStudentsWithAgendaStatus(attendantPersonId: number) {
  const relations = await getAttendantRelations(attendantPersonId);
  const agendaDays = await getAgendaDayToday();

  const allAgendaDayStudents = await Promise.all(
    agendaDays.map(d => getAgendaDayStudents(d.agendaDayId))
  );

  const studentsWithAgenda = new Set(allAgendaDayStudents.flat().map(s => s.studentId));

  return await Promise.all(
    relations.map(async student => {
      const hasAgendaToday = studentsWithAgenda.has(student.studentId);

      if (!hasAgendaToday) return { ...student, agendaStatus: "no-agenda" };

      const confirmations = await getStudentConfirmations(student.studentId);
      const todayAgenda = agendaDays.find(day =>
        allAgendaDayStudents.flat().some(r =>
          r.studentId === student.studentId && r.agendaId === day.agendaId
        )
      );

      const isCompleted = confirmations.some(
        c => c.agendaDayId === todayAgenda?.agendaDayId &&
             c.agendaDayStudentStatus === 1
      );

      return { ...student, agendaStatus: isCompleted ? "completed" : "pending" };
    })
  );
}
