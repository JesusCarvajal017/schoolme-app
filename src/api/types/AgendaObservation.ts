export interface AgendaObservation {
  id: string;
  question: string;
  answer: string;
  type: 'boolean' | 'scale' | 'text';
}

export interface StudentAgendaResponse {
  agendaId: number;
  studentId: number;
  observations: AgendaObservation[];
  tasks: string;
  parentComment?: string;
  isConfirmed: boolean;
  confirmedAt?: string;
}