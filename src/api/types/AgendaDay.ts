export interface AgendaDay {
  id: number;
  agendaId: number;
  agendaDayStatus: number;
  openAt: string; // ISO date string
  closeAt: string; // ISO date string
  status: number;
}