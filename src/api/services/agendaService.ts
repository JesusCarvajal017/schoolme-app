// src/api/services/agendaService.ts
import { Petitioner } from '../../util/fetchClass';
import { environment } from '../constant/Enviroment';

const http = new Petitioner();
const baseUrl = environment.urlApi;

// Función simplificada que devuelve datos mock mientras se implementa la API
export async function getStudentCurrentAgenda(studentId: number): Promise<{
  agenda: any;
  agendaDay: any;
  group: any;
  observations: any[];
}> {
  try {
    // Intentar obtener datos reales de la API
    // Si fallan usar datos mock
    
    // Por ahora retornamos datos de ejemplo que funcionan
    const mockData = {
      agenda: {
        id: 1,
        name: "Agenda Diaria",
        description: "Seguimiento académico y comportamental",
        compositionAgenda: '[]',
        agendaDay: 1,
        group: "Once-A",
        status: 1
      },
      agendaDay: {
        id: 1,
        agendaId: 1,
        agendaDayStatus: 1,
        openAt: new Date().toISOString(),
        closeAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 1
      },
      group: {
        id: 1,
        name: "Once-A",
        status: 1
      },
      observations: [
        { id: '1', question: '¿Fui puntual?', answer: 'Sí', type: 'boolean' },
        { id: '2', question: '¿Trabajé en clase?', answer: 'Muy Poco', type: 'scale' },
        { id: '3', question: '¿Me porté bien?', answer: 'No', type: 'boolean' },
        { id: '4', question: '¿Cumplí con mis tareas?', answer: 'Sí', type: 'boolean' },
        { id: '5', question: '¿Comí bien?', answer: 'Sí', type: 'boolean' },
        { id: '6', question: '¿Tengo trabajos para casa?', answer: 'Sí', type: 'boolean' }
      ]
    };

    return mockData;
  } catch (error) {
    console.error('Error loading agenda data:', error);
    throw error;
  }
}

// Función simplificada para confirmar lectura
export async function confirmAgendaReading(
  agendaDayStudentId: number, 
  parentComment?: string
): Promise<void> {
  try {
    // Por ahora simulamos una confirmación exitosa
    console.log('Confirmando lectura:', { agendaDayStudentId, parentComment });
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En el futuro, aquí irá la llamada real a la API:
    // return await http.command(
    //   `${baseUrl}/AgendaDayStudent/${agendaDayStudentId}/confirm`, 
    //   { parentComment, isConfirmed: true, confirmedAt: new Date().toISOString() }, 
    //   "PUT"
    // );
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error confirming agenda reading:', error);
    throw new Error('No se pudo confirmar la lectura de la agenda');
  }
}