import api from "./api";
import type {serverFilter, Offer, Space} from "@/pages/drives/drivesService.tsx";


//post calls
export async function createOffer(offer:Offer) {

  const response = await api.post("/angebot", offer);
  return response.data;
}

export async function searchOffersByFilter(filter:serverFilter) {

  const response = await api.post("/angebot/filter", {filter:filter  });
  return response.data;
}

export async function occupyOffer(id: string, space:Space) {
  const response = await api.post(`/angebot/${id}/occupy`, { userId:sessionStorage.getItem("UserID"),space:space });
  return response.data;
}

//get calls
export async function getOfferDetails(id: string) {
  const response = await api.get(`/angebot/${id}`);
  return response.data;
}

export async function postRating(id: string, rating: {
  answers: { content: string; value: number }[];
  comment: string;
  targetId: string;
  userId: string | null
}) {
  const response = await api.post(`/angebot/${id}/rating`, {rating});
  return response.data;
}

export async function payOffer(id: string, userId: string) {
  const response = await api.post(`/angebot/${id}/pay`,{userId:userId});
  return response.data;
}