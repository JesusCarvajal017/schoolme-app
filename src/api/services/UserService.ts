// src/api/services/userService.ts
import { Petitioner } from '../../util/fetchClass';
import { environment } from '../constant/Enviroment';
import { User } from '../types/User';

const http = new Petitioner();
const baseUrl = environment.urlApi;

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  return await http.querys<User[]>(`${baseUrl}/User`);
}

// Obtener un usuario por ID
export async function getUserById(id: number): Promise<User> {
  return await http.querys<User>(`${baseUrl}/User/${id}`);
}

export async function updateUserEmail(userId: number, email: string, personId: number, status: number): Promise<User> {
  return await http.command<User>(`${baseUrl}/User`, {
    id: userId,
    email,
    personId,
    status
  }, 'PATCH');
}

export async function changePassword(
  idUser: number,
  passwordNew: string,
  passwordConfirm: string
): Promise<boolean> {
  const payload = { idUser, passwordNew, passwordConfirm };
  const response = await http.command<boolean>(`${baseUrl}/User/passwordUpdate`, payload, 'POST');
  return response;
}

export async function uploadUserPhoto(userId: number, imageUri: string): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('Id', String(userId)); // Nombre exacto del DTO
    formData.append('Photo', {
      uri: imageUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch(`${environment.urlApi}/User/photoUpdate`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error subiendo foto:', error);
    return false;
  }
}
