// Profilspezifischer Service - nur für deine Komponente


export interface ProfileData {
    firstName: string;
    lastName: string;
    language: string;
    birthDate: string;
    notes: string;
}

export interface serverUser {
    id: string;
    birthDate: string;
    firstName: string;
    lastName: string;
    email: string;

    phoneNumber: string;
}
export async function fetchProfile(userId: string) {
  try {
    const token = sessionStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api/user/${userId}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Laden des Profils: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Laden des Profils:', error);
    throw error;
  }
}

export function updateProfile (profileData: ProfileData) {
const user :serverUser = {birthDate: "", email: "", firstName: "", id: "", lastName: "", phoneNumber: ""};

    user.firstName = profileData.firstName||user.firstName;
    user.lastName = profileData.lastName||user.lastName;
    user.birthDate = profileData.birthDate == "0001-01-01T00:00:00Z"?user.birthDate:profileData.birthDate;

    return user;
}

export async function fetchRatings(userId: string) {
  try {
    const response = await fetch(`/api/ratings/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Bewertungen: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Laden der Bewertungen:', error);
    throw error;
  }
}

export async function uploadProfileImage(userId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = sessionStorage.getItem('token');
    const response = await fetch(`/api/user/${userId}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Hochladen des Bildes: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    throw error;
  }
}