// services/personService.ts
import { Petitioner } from '../../util/fetchClass';
import { environment } from '../constant/Enviroment';
import { PersonData } from '../types/Person';

const http = new Petitioner();
const baseUrl = environment.urlApi;

// Obtener datos completos de una persona por ID
export async function getPersonById(id: number): Promise<PersonData> {
  return await http.querys<PersonData>(`${baseUrl}/Person/data/${id}`);
}