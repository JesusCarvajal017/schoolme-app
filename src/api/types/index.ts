// Reexportar módulos que sí exportan correctamente
export * from './User';
export * from './Person';
export * from './Roles';
export * from './DataBasic';
export * from './Department';
export * from './DocumentType';
export * from './Eps';
export * from './Municipality';
export * from './Grade';

// Reexportar tipos individuales
export type { User } from './User';
export type { PersonData as Person } from './Person';
export type { Roles } from './Roles';
export type { DataBasic } from './DataBasic';
export type { Department } from './Department';
export type { DocumentType } from './DocumentType';
export type { Eps } from './Eps';
export type { Municipality } from './Municipality';
export type { Grade } from './Grade';

// Importaciones explícitas desde archivos que no exportan todo correctamente
import { Agenda } from './Agenda';
import { AgendaDay } from './AgendaDay';
import { AgendaDayStudent } from './AgendaDayStudent';
import { StudentAgendaResponse } from './AgendaObservation';
import { Group } from './Group';
import { Students } from './Students';

// Reexportar tipos válidos
export type {
  Agenda,
  AgendaDay,
  AgendaDayStudent,
  StudentAgendaResponse,
  Group,
  Students
};
