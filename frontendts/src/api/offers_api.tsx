import api from "./api";
import type {Filter, Offer} from "@/pages/drives/drivesService.tsx";


//post calls
export async function createOffer(offer:Offer) {

  const response = await api.post("/angebot", offer);
  return response.data;
}

export async function searchOffersByFilter(filter:Filter) {

  const response = await api.post("/angebot/filter", {filter:filter  });
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

export async function postRating(id: string, rating: any) {
  const response = await api.post(`/angebot/${id}/rating`, {rating});
}