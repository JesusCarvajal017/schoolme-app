export interface AgendaDayStudent {
  id: number;
  agendaDayId: number;
  studentId: number;
  attendantStudentStatus: number;
  completedAt: string; // ISO date string
  status: number;
}