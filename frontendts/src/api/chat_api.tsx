import api from "./api";

//post calls
export async function createChat() {
  const response = await api.post(`/chat`, {  });
  return response.data;
}

export async function postMessage(id: string) {
  const response = await api.post(`/chat/${id}/messages`, {  });
  return response.data;
}

//get calls
export async function getChat() {
  const response = await api.get(`/chat`);
  return response.data;
}

export async function getChatMessages(id: string) {
  const response = await api.get(`/chat/${id}`);
  return response.data;
}