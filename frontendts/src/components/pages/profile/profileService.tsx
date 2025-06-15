// Profilspezifischer Service - nur für deine Komponente

export async function fetchProfile(userId: string) {
  try {
    const token = localStorage.getItem('token');
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

export async function updateProfile(userId: string, profileData: any) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Speichern des Profils: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Speichern des Profils:', error);
    throw error;
  }
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
    
    const token = localStorage.getItem('token');
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