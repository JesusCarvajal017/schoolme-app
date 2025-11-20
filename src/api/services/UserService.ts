// src/api/services/userService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Obtener un usuario por email (sin autenticación para recuperación de contraseña)
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await fetch(`${baseUrl}/User/GetByEmail/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const user = contentType.includes("application/json") ? await response.json() : null;
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario por email:', error);
    return null;
  }
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

    // Usar Petitioner para incluir el token de autenticación
    const response = await fetch(`${environment.urlApi}/User/photoUpdate`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        // Incluir el token manualmente ya que Petitioner no maneja FormData directamente
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error subiendo foto:', error);
    return false;
  }
}
