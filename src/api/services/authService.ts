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
