import api from "./api";

//post calls
export async function createChat(userIds: string[]) {
  const response = await api.post(`/chat`, { userIds: userIds });

  return response.data;
}

export async function postMessage(id: string, content: string) {

  const response = await api.post(`/chat/${id}`, { content: content ,},);
  return response.data;
}

//get calls
export async function getChats() {
  const response = await api.get(`/chat`);

  return response.data;
}

export async function getChatMessages(id: string) {
  const response = await api.get(`/chat/${id}`);
  return response.data;
}

export  function connectWebSocket(id: string) {
  const token = sessionStorage.getItem("token"); // oder aus deinem api-Modul holen
    return new WebSocket(`api/ws/chat/${id}?token=${token}`);

}

export  function connectTrackingWebSocket() {
    return new WebSocket(
      `/api/tracking?token=${sessionStorage.getItem("token")}`,
  );

}