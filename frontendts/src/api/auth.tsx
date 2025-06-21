import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/login", { email, password });
  return response.data;
}

export async function register(firstName: string, lastName: string, email: string, password: string) {
  const response = await api.post("/", { firstName, lastName, email, password });
  return response.data;
}