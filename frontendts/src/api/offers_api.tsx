import api from "./api";


//post calls
export async function createOffer() {
  const response = await api.post("/angebot", {  });
  return response.data;
}

export async function searchOffersByFilter() {
  const response = await api.post("/angebot/filter", {  });
  return response.data;
}

export async function occupyOffer(id: string) {
  const response = await api.post(`/angebot/${id}/occupy`, {  });
  return response.data;
}

//get calls
export async function getOfferDetails(id: string) {
  const response = await api.get(`/angebot/${id}`);
  return response.data;
}