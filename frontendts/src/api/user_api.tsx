import api from "./api";
import type {serverUser} from "@/pages/profile/profileService.tsx";

//all USER ROUTE API CALLS 

//get calls
export async function getUserID() {
  const response = await api.get("/user/self");
  return response.data;
}

//TO IMPLEMENT

export async function getUserByEmail() {
  const response = await api.get("/user/email");
  return response.data;
}

export async function getUserByID(id:string) {
  const response = await api.get("/user/"+id);
  return response.data;
}

export async function getUserRating() {
    const id =  sessionStorage.getItem("UserID");
  const response = await api.get(`/user/${id}/rating`);
  return response.data;
}

export async function getLoggedInUser() {
  const response = await api.get("/user");
  return response.data;
}

//post calls
export async function login(email: string, password: string) {
  const response = await api.post("/user/login", { email, password });
  return response.data;
}

export async function register(firstName: string, lastName: string, email: string, password: string) {
  const response = await api.post("/user/", { firstName, lastName, email, password });
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
export async function updateUser(user:serverUser) {
    const id =  sessionStorage.getItem("UserID");
    const token = sessionStorage.getItem("token");
  const response = await api.put( `/user/${token}`, user, {
      headers: {userId:id}
  } );
  return response.data;
}

//delete
export async function deleteUser(userId:string) {
  const response = await api.delete("/user/"+userId);
  return response.data;
}