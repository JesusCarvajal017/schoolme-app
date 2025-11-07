import { environment } from '../constant/Enviroment';
import { RolUser } from '../types/RolUser';

export async function getRolesByUserId(userId: number): Promise<RolUser[]> {
  try {
    const response = await fetch(`${environment.urlApi}/UserRol/RolesUsuario/${userId}`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const text = await response.text();
    if (!text) return [];

    return JSON.parse(text);
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return [];
  }
}
