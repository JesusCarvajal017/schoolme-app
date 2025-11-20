import {jwtDecode} from "jwt-decode";

type Decoded = {
  exp?: number;
  [key: string]: any;
};

export const tokenValido = (token: string): boolean => {
  try {
    const decoded: Decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

// Programa el cierre de sesión cuando el token expire
export const manejarToken = (token: string, logout: () => Promise<void>) => {
  try {
    const decoded: Decoded = jwtDecode(token);
    if (!decoded.exp) {
      logout();
      return;
    }
    const msRestantes = decoded.exp * 1000 - Date.now();
    if (msRestantes <= 0) {
      logout();
      return;
    }
    // Importante: en un contexto real, guarda este timeout para poder limpiarlo en logout si lo deseas.
    setTimeout(() => {
      logout();
    }, msRestantes);
  } catch {
    logout();
  }
};
