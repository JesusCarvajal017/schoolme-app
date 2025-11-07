export interface User {
  id: number;
  email: string;
  password: string;   // En backend sigue existiendo, aunque no se exponga en GET
  personId: number;   // Relación con Person
  photo: string;      // Nombre de archivo en backend (e.g., "default.jpg")
  status: number;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
}
  