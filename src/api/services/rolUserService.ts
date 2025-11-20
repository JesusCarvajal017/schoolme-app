import { Petitioner } from '../../util/fetchClass';
import { environment } from '../constant/Enviroment';
import { RolUser } from '../types/RolUser';

const http = new Petitioner();
const baseUrl = environment.urlApi;

export async function getRolesByUserId(userId: number): Promise<RolUser[]> {
  try {
    return await http.querys<RolUser[]>(`${baseUrl}/UserRol/RolesUsuario/${userId}`);
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return [];
  }
}
