import api from "./api";

//post calls
export async function uploadPictureForCompound(id: string, file: File) {
  const response = await api.post(`/media/multi/${id}`, file, {
    headers: {
      'Content-Type': file.type,
    }
  });
  return response.data;
}


//get calls
export async function getCompoundImageLink(id: string) {
  const response = await api.get(`/media/multi/${id}`);
  return response.data;
}

