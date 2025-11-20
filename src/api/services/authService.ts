// src/api/services/authService.ts
import { Petitioner } from "../../util/fetchClass";
import { environment } from "../constant/Enviroment";
import { Person } from "../types";
import { User } from "../types/User";


const http = new Petitioner();
const baseUrl = environment.urlApi;

export interface AuthResponse {
  token: string;
  user: User;
  person: Person;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const payload = { email, password };
  return await http.command<AuthResponse>(`${baseUrl}/Auth`, payload, "POST");
}

export async function getCurrentUser(): Promise<User> {
  return await http.querys<User>(`${baseUrl}/Auth/me`);
}

export async function getCurrentPerson(personId: number): Promise<Person> {
  return await http.querys<Person>(`${baseUrl}/Person/${personId}`);
}

// Sends the password reset code to the user's email (sin autenticación)
export const sendResetCode = async (email: string) => {
  try {
    const response = await fetch(`${baseUrl}/Auth/ResetPassword/${email}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const json = contentType.includes("application/json") ? await response.json() : undefined;
    return json;
  } catch (error) {
    throw error;
  }
};

// Validates the verification code entered by the user (sin autenticación)
export const validateVerificationCode = async (email: string, code: string) => {
  try {
    const response = await fetch(`${baseUrl}/Auth/ValidationCode/${email}/${code}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const json = contentType.includes("application/json") ? await response.json() : undefined;
    return json;
  } catch (error) {
    throw error;
  }
};

// Resets the password for password recovery (sin autenticación)
export const resetPassword = async (userId: number, newPassword: string, confirmPassword: string) => {
  try {
    const response = await fetch(`${baseUrl}/User/passwordUpdate`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUser: userId, passwordNew: newPassword, passwordConfirm: confirmPassword }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const json = contentType.includes("application/json") ? await response.json() : undefined;
    return json;
  } catch (error) {
    throw error;
  }
};
