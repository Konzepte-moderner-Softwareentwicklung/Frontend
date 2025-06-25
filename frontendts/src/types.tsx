export interface User {
  id?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
