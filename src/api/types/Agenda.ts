
export interface AttendantRelation {
  attendantId: number;
  nameAttendant: string;
  relationShipType: number;
  document: number;
  studentId: number;
  nameStudent: string;
  documentTypeId: number;
  acronymDocument: string;
  identification: number;
  id: number;
  status: number;
}

export interface StudentAcademicInfo {
  studentId: number;
  grade: string;
  group: string;
  groupId: number;
  classroom: string;
  teacher: {
    id: number;
    name: string;
  };
}

// ==================== AGENDA Y DÍA ====================

export interface Agenda {
  name: string;
  description: string;
  id: number;
  status: number;
}

export interface AgendaDayToday {
  agendaDayId: number;
  agendaId: number;
  groupId: number;
  agendaName: string;
  groupName: string;
  date: string;
  state: number;
  id: number;
  status: number;
}

export interface AgendaDayStudentRecord {
  agendaDayStudentId: number;
  studentId: number;
  fullName: string;
  document: string;
  typeDocumetation: string;
  agendaId: number;
}

export interface AgendaDayStudent {
  agendaDayId: number;
  studentId: number;
  agendaDayStudentStatus: number;
  completedAt: string;
  agendaDay: any | null;
  student: any | null;
  studentAnswers: any[];
  teacherObservation: any | null;
  id: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
}

// ==================== PREGUNTAS Y OPCIONES ====================

export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  order: number;
  status: number;
}

export interface AgendaQuestion {
  text: string;
  typeAnswerId: number;
  nameAnswer: string;
  options: QuestionOption[];
  id: number;
  status: number;
}

// ==================== RESPUESTAS ====================

export interface StudentAnswer {
  questionId: number;
  valueText: string | null;
  valueBool: boolean | null;
  valueNumber: number | null;
  valueDate: string | null;
  optionIds: number[];
  id: number;
  status: number;
}

export interface StudentAnswersResponse {
  agendaDayStudentId: number;
  answers: StudentAnswer[];
  id: number | null;
  status: number;
}

// ==================== CONTEXTO COMPLETO ====================

export interface AgendaContext {
  student: AttendantRelation;
  agendaDay: AgendaDayToday;
  agendaDayStudentRecord: AgendaDayStudentRecord;
  questions: AgendaQuestion[];
  studentAnswers: StudentAnswersResponse | null;
  teacherObservations: TeacherObservation[];
  isCompleted: boolean;
}

// ==================== OBSERVACIONES DE PROFESORES ====================

export interface TeacherObservation {
  teacherId: number;
  agendaDayStudentId: number;
  academicLoadId: number;
  text: string;
  teacherName: string;
  subjectName: string;
  groupName: string;
  gradeName: string;
  id: number;
  status: number;
}

export interface TeacherObservationDetail {
  teacherId: number;
  agendaDayStudentId: number;
  text: string;
  academicLoadId: number;
  id: number;
  status: number;
}

// ==================== EXTENSIÓN PARA LISTA ====================

export interface StudentWithAgendaStatus extends AttendantRelation {
  agendaStatus: 'completed' | 'pending' | 'no-agenda';
}
