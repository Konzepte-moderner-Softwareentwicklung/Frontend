import api from "./api";

//post calls
export async function createChat(userIds: string[]) {
  const response = await api.post(`/chat`, { userIds: userIds });
  return response.data;
}

export async function postMessage(id: string, content: string) {
  const response = await api.post(`/chat/${id}`, { content: content });
  return response.data;
}

//get calls
export async function getChats() {
  const response = await api.get(`/chat`);
  console.log(response.data);
  return response.data;
}

export async function getChatMessages(id: string) {
  const response = await api.get(`/chat/${id}`);
  return response.data;
}

export  function connectWebSocket(id: string) {
  const token = localStorage.getItem("token"); // oder aus deinem api-Modul holen
  const socket = new WebSocket(`api/ws/chat/${id}?token=${token}`);
  console.log(socket)
  return socket;

}

export  function connectTrackingWebSocket() {
  const token = localStorage.getItem("token"); // oder aus deinem api-Modul holen
  const socket = new WebSocket(`tracking/?token=${token}`);
  console.log(socket)
  return socket;

}