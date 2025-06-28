import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProfile, updateProfile, fetchRatings, uploadProfileImage } from './profileService';

// Typdefinition für Profile-Daten
interface ProfileData {
  firstName: string;
  lastName: string;
  smoker: string;
  language: string;
  birthDate: string;
  notes: string;
  stats: {
    passengers: number;
    weight: string | number;
    distance: number;
  };
}

// Typ für Bewertungen
interface Rating {
  id: string;
  stars: number;
  title: string;
  comment: string;
  userName: string;
  userImage: string;
  date: string;
}

// Testdaten für Bewertungen
const mockRatings: Rating[] = [
  {
    id: "1",
    stars: 5,
    title: "Sehr empfehlenswert",
    comment: "Sehr pünktlich, sauber und freundlich. Würde jederzeit wieder mitfahren.",
    userName: "Laura M.",
    userImage: "https://i.pravatar.cc/150?img=1",
    date: "15.05.2025"
  },
  {
    id: "2",
    stars: 1,
    title: "Finger weg!!",
    comment: "Zu spät gekommen und unfreundlich. Auto war dreckig und unbequem.",
    userName: "Felix S.",
    userImage: "https://i.pravatar.cc/150?img=6",
    date: "10.04.2025"
  },
  {
    id: "3",
    stars: 5,
    title: "Tolle Fahrt!",
    comment: "Super Fahrer! Hilfsbereit beim Gepäck und interessante Gespräche.",
    userName: "Sophie L.",
    userImage: "https://i.pravatar.cc/150?img=3",
    date: "28.04.2025"
  },
  {
    id: "4",
    stars: 3,
    title: "Okay, aber...",
    comment: "Fahrt war in Ordnung, aber etwas zu schnell unterwegs für meinen Geschmack.",
    userName: "Martin W.",
    userImage: "https://i.pravatar.cc/150?img=4",
    date: "21.04.2025"
  },
  {
    id: "5",
    stars: 4,
    title: "Immer wieder!",
    comment: "Perfekte Fahrt, super Musik und angenehmes Klima im Auto.",
    userName: "Julia B.",
    userImage: "https://i.pravatar.cc/150?img=5",
    date: "15.04.2025"
  },
  {
    id: "6",
    stars: 1,
    title: "Nie wieder",
    comment: "Fahrer war unhöflich und hat mich am Zielort abgesetzt, ohne zu helfen.",
    userName: "Max T.",
    userImage: "https://i.pravatar.cc/150?img=8",
    date: "01.04.2025"
  },
  {
    id: "7",
    stars: 5,
    title: "Absolute Empfehlung",
    comment: "Eine der besten Mitfahrgelegenheiten, die ich je hatte! Zuverlässig und super nett.",
    userName: "Nina R.",
    userImage: "https://i.pravatar.cc/150?img=7",
    date: "05.04.2025"
  },
  {
    id: "8",
    stars: 4,
    title: "Entspannte Reise",
    comment: "Angenehme Unterhaltung und gute Fahrt. Ein Stern Abzug wegen kleiner Verspätung.",
    userName: "Thomas K.",
    userImage: "https://i.pravatar.cc/150?img=2",
    date: "02.05.2025"
  }
];

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    smoker: "nonsmoker",
    language: "deutsch",
    birthDate: "",
    notes: "",
    // Neue Erfahrungswerte
    stats: {
      passengers: 74,
      weight: "Elefant",
      distance: 3400,
    }
  });

  // Bewertungsdaten
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);

  // Bild-Daten
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Berechne Bewertungsstatistiken
  const calculateRatingStats = () => {
    if (!ratings.length) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    
    const total = ratings.length;
    const sum = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const average = sum / total;
    
    // Zähle Bewertungen pro Stern
    const distribution = [0, 0, 0, 0, 0]; // Index 0 = 1 Stern, usw.
    ratings.forEach(rating => {
      distribution[rating.stars - 1]++;
    });
    
    // Konvertiere zu Prozentsätzen
    const distributionPercent = distribution.map(count => (count / total) * 100);
    
    return { average: average.toFixed(1), total, distribution: distributionPercent };
  };

  const ratingStats = calculateRatingStats();

  // Daten aus API laden
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Beispiel - ersetze mit deiner User-ID-Quelle
        const userId = sessionStorage.getItem('userId') || 'current';
        const data = await fetchProfile(userId);
        setProfileData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    // Diese Zeile aktivieren, wenn API bereit ist
    loadProfile();
  }, []);

  // Ähnliche Änderung für das Laden der Bewertungen...
  useEffect(() => {
    console.log(sessionStorage.getItem("UserID"));
    const fetchRatings = async () => {
      setIsLoading(true);
      try {
        // API-Endpunkt für Bewertungen
        const response = await fetch('/api/ratings');
        const data = await response.json();
        
        // Daten in den State übernehmen
        setRatings(data);
      } catch (error) {
        console.error('Fehler beim Laden der Bewertungen:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Diese Zeile aktivieren, wenn API bereit ist
     fetchRatings();
  }, []); // Leeres Dependency-Array: Lädt nur beim ersten Render

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userId = sessionStorage.getItem('userId') || 'current';
      
      // Profildaten aktualisieren
      await updateProfile(userId, profileData);
      
      // Bild hochladen, wenn eins ausgewählt wurde
      if (selectedFile) {
        console.log("Lade Bild hoch:", selectedFile.name);
        await uploadProfileImage(userId, selectedFile);
        // Setze selectedFile zurück nach erfolgreichem Upload
        setSelectedFile(null);
      }
      
      alert("Profil erfolgreich gespeichert!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload-Fehler:", error);
        alert(`Fehler beim Speichern: ${error.message}`);
      } else {
        alert("Fehler beim Speichern: Unbekannter Fehler");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Hilfsfunktion zum Rendern der Sterne
  const renderStars = (starCount: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={i < starCount ? "#FFB800" : "#D1D5DB"}
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mein Profil</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profilbild */}
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center flex-grow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 016 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          {/* Formularfelder */}
          <div className="w-full md:w-2/3 flex flex-col md:pl-8">
            <div className="flex flex-col h-full space-y-4">
              {/* Erste Zeile: Vorname, Nachname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  placeholder="Vorname"
                />
                
                <Input 
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  placeholder="Nachname"
                />
              </div>
              
              {/* Zweite Zeile: Raucher/Nichtraucher, Sprache, Geburtsdatum */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={profileData.smoker}
                  onValueChange={(value) => handleSelectChange("smoker", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Raucher/Nichtraucher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smoker">Raucher</SelectItem>
                    <SelectItem value="nonsmoker">Nichtraucher</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={profileData.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sprache" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deutsch">Deutsch</SelectItem>
                    <SelectItem value="english">Englisch</SelectItem>
                    <SelectItem value="français">Französisch</SelectItem>
                    <SelectItem value="español">Spanisch</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={profileData.birthDate}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Geburtsdatum"
                />
              </div>
              
              {/* Dritte Zeile: Notizen */}
              <div className="flex-grow flex flex-col">
                <Textarea
                  id="notes"
                  name="notes"
                  value={profileData.notes}
                  onChange={handleChange}
                  placeholder="Zusätzliche Informationen über dich..."
                  className="h-full min-h-[200px] resize-none" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Buttons auf gleicher Höhe */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            className="w-64"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Bild ändern
          </Button>
          
          <Button type="submit" className="px-8">
            Änderungen speichern
          </Button>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Nach dem versteckten Input */}
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600">
            Ausgewähltes Bild: {selectedFile.name}
          </div>
        )}
      </form>
      
      {/* Erfahrungen/Statistiken - kompakter */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Meine Erfahrung</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Karte: Beförderte Mitfahrer */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-2xl">{profileData.stats.passengers}</div>
                <div className="text-gray-500 text-sm">beförderte Mitfahrer</div>
              </div>
            </div>
          </div>
          
          {/* Karte: Befördertes Gewicht */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-2xl">{profileData.stats.weight}</div>
                <div className="text-gray-500 text-sm">befördertes Gewicht</div>
              </div>
            </div>
          </div>
          
          {/* Karte: Zurückgelegte Strecke */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-2xl">{profileData.stats.distance} KM</div>
                <div className="text-gray-500 text-sm">zurückgelegte Strecke</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bewertungen - Code bleibt unverändert */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Bewertungen</h2>
        
        <div className="flex overflow-x-auto gap-4 pb-4">
          {/* Bewertungsstatistik-Karte */}
          <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100 min-w-[280px] flex-none">
            <div className="flex flex-col items-center mb-4">
              <div className="text-4xl font-bold text-gray-800">{ratingStats.average}</div>
              <div className="flex mt-1 mb-2">
                {renderStars(Math.round(Number(ratingStats.average)))}
              </div>
              <div className="text-gray-500 text-sm">Basierend auf {ratingStats.total} Bewertungen</div>
            </div>
            
            <div className="space-y-2 mt-4">
              {/* 5 Sterne */}
              <div className="flex items-center">
                <span className="text-xs w-10">5 ★</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-green-600" style={{ width: `${ratingStats.distribution[4]}%` }}></div>
                </div>
                <span className="text-xs w-10 text-right">{Math.round(ratingStats.distribution[4])}%</span>
              </div>
              
              {/* 4 Sterne */}
              <div className="flex items-center">
                <span className="text-xs w-10">4 ★</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-green-400" style={{ width: `${ratingStats.distribution[3]}%` }}></div>
                </div>
                <span className="text-xs w-10 text-right">{Math.round(ratingStats.distribution[3])}%</span>
              </div>
              
              {/* 3 Sterne */}
              <div className="flex items-center">
                <span className="text-xs w-10">3 ★</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-yellow-400" style={{ width: `${ratingStats.distribution[2]}%` }}></div>
                </div>
                <span className="text-xs w-10 text-right">{Math.round(ratingStats.distribution[2])}%</span>
              </div>
              
              {/* 2 Sterne */}
              <div className="flex items-center">
                <span className="text-xs w-10">2 ★</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-orange-400" style={{ width: `${ratingStats.distribution[1]}%` }}></div>
                </div>
                <span className="text-xs w-10 text-right">{Math.round(ratingStats.distribution[1])}%</span>
              </div>
              
              {/* 1 Stern */}
              <div className="flex items-center">
                <span className="text-xs w-10">1 ★</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${ratingStats.distribution[0]}%` }}></div>
                </div>
                <span className="text-xs w-10 text-right">{Math.round(ratingStats.distribution[0])}%</span>
              </div>
            </div>
          </div>
          
          {/* Einzelne Bewertungskarten */}
          {ratings.map(rating => (
            <div 
              key={rating.id} 
              className="bg-white rounded-lg p-5 shadow-md border border-gray-100 min-w-[280px] max-w-[280px] flex-none"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{rating.title}</div>
                  <div className="flex mt-1">
                    {renderStars(rating.stars)}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{rating.date}</div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {rating.comment}
              </p>
              
              <div className="flex items-center mt-auto">
                <img 
                  src={rating.userImage} 
                  alt={rating.userName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm font-medium">{rating.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}