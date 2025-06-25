import api from "./api";

//all USER ROUTE API CALLS 

//get calls
export async function getUserID() {
  const response = await api.get("/user/self");
  return response.data;
}

//TO IMPLEMENT
export async function getAllUsers() {
  const response = await api.get("/user");
  return response.data;
}

export async function getUserByEmail() {
  const response = await api.get("/user/email");
  return response.data;
}

export async function getUserByID() {
  const response = await api.get("/user/{ID}");
  return response.data;
}

export async function getUserRating() {
  const response = await api.get("/user/");
  return response.data;
}

export async function getUserRatingbyID() {
  const response = await api.get("/user/");
  return response.data;
}

//post calls
export async function login(email: string, password: string) {
  const response = await api.post("/user/login", { email, password });
  return response.data;
}

export async function register(firstName: string, lastName: string, email: string, password: string) {
  const response = await api.post("/", { firstName, lastName, email, password });
  return response.data;
}

//TO IMPLEMENT
export async function loginWithWebAuthn() {
  const response = await api.post("/", {  });
  return response.data;
}

export async function registerWithWebAuthn() {
  const response = await api.post("/", {  });
  return response.data;
}

export async function registerOptionsWithWebAuthn() {
  const response = await api.post("/", {  });
  return response.data;
}

//put call
export async function updateUser() {
  const response = await api.put("/", {  });
  return response.data;
}

//delete
export async function deleteUser() {
  const response = await api.delete("/", {  });
  return response.data;
}