import api from "./api";

//post calls
export async function uploadPicture(file: File) {
  const response = await api.post(`/media/image`, file, {
    headers: {
      'Content-Type': file.type,
    }
  });
  return response.data;
}

export async function uploadPictureForCompound(id: string, file: File) {
  const response = await api.post(`/media/multi/${id}`, file, {
    headers: {
      'Content-Type': file.type,
    }
  });
  return response.data;
}


//get calls
export async function healthCheck() {
  const response = await api.get(`/media/image`);
  return response.data;
}

export async function downloadPicture(id: string) {
  const response = await api.get(`/media/image/${id}`);
  return response.data;
}

export async function getCompoundImageLink(id: string) {
  const response = await api.get(`/media/multi/${id}`);
  return response.data;
}

