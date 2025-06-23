// Chat API Service für das Laden und Senden von Nachrichten

// Interface für einen Chat-Kontakt
export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// Interface für eine Chat-Nachricht
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Mock-Daten für die Entwicklung
const mockContacts: ChatContact[] = [
  {
    id: "1",
    name: "Anna Schmidt",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Wann kommst du morgen vorbei?",
    lastMessageTime: "10:42",
    unreadCount: 2
  },
  {
    id: "2",
    name: "Max Mustermann",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Danke für die Mitfahrgelegenheit!",
    lastMessageTime: "Gestern",
    unreadCount: 0
  },
  {
    id: "3",
    name: "Laura Meier",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Ich bitte um Rückruf.",
    lastMessageTime: "10:42",
    unreadCount: 0
  },
  {
    id: "4",
    name: "Tim Berger",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Passt 16:00 Uhr für dich?",
    lastMessageTime: "Montag",
    unreadCount: 0
  },
  {
    id: "5",
    name: "Sarah Krause",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Super, danke für die Info!",
    lastMessageTime: "23.05.2025",
    unreadCount: 0
  }
];

// Mock-Nachrichten für jeden Kontakt
const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "101",
      senderId: "1",
      receiverId: "current",
      content: "Hallo! Fährst du morgen wieder nach Hamburg?",
      timestamp: "2025-05-28T09:30:00Z",
      read: true
    },
    {
      id: "102",
      senderId: "current",
      receiverId: "1",
      content: "Ja, ich fahre um 8 Uhr los. Möchtest du mitfahren?",
      timestamp: "2025-05-28T09:35:00Z",
      read: true
    },
    {
      id: "103",
      senderId: "1",
      receiverId: "current",
      content: "Das wäre super! Können wir uns am Hauptbahnhof treffen?",
      timestamp: "2025-05-28T09:40:00Z",
      read: true
    },
    {
      id: "104",
      senderId: "current",
      receiverId: "1",
      content: "Klar, gegen 7:45 Uhr am Ausgang Ost?",
      timestamp: "2025-05-28T09:42:00Z",
      read: true
    },
    {
      id: "105",
      senderId: "1",
      receiverId: "current",
      content: "Wann kommst du morgen vorbei?",
      timestamp: "2025-05-28T10:42:00Z",
      read: false
    }
  ],
  "2": [
    {
      id: "201",
      senderId: "2",
      receiverId: "current",
      content: "Hey, kann ich morgen bei deiner Fahrt nach Berlin mitfahren?",
      timestamp: "2025-05-27T14:20:00Z",
      read: true
    },
    {
      id: "202",
      senderId: "current",
      receiverId: "2",
      content: "Natürlich! Treffen um 9 Uhr am üblichen Ort?",
      timestamp: "2025-05-27T14:25:00Z",
      read: true
    },
    {
      id: "203",
      senderId: "2",
      receiverId: "current",
      content: "Perfect, bin dabei. Was soll ich für die Fahrt mitbringen?",
      timestamp: "2025-05-27T14:30:00Z",
      read: true
    },
    {
      id: "204",
      senderId: "current",
      receiverId: "2",
      content: "Ein paar Snacks wären super, ich kümmere mich um die Getränke!",
      timestamp: "2025-05-27T14:40:00Z",
      read: true
    },
    {
      id: "205",
      senderId: "2",
      receiverId: "current",
      content: "Danke für die Mitfahrgelegenheit!",
      timestamp: "2025-05-27T18:30:00Z",
      read: true
    }
  ],
  "3": [
    {
      id: "301",
      senderId: "3",
      receiverId: "current", 
      content: "Hallo! Ich muss unsere Fahrt morgen leider absagen.",
      timestamp: "2025-05-26T15:10:00Z",
      read: true
    },
    {
      id: "302",
      senderId: "current",
      receiverId: "3",
      content: "Kein Problem, ist etwas passiert?",
      timestamp: "2025-05-26T15:15:00Z",
      read: true
    },
    {
      id: "303",
      senderId: "3",
      receiverId: "current",
      content: "Nichts Schlimmes, aber ich muss kurzfristig zu einem Termin. Können wir nächste Woche fahren?",
      timestamp: "2025-05-26T15:20:00Z", 
      read: true
    },
    {
      id: "304",
      senderId: "current",
      receiverId: "3",
      content: "Ja klar! Ich fahre jeden Montag und Mittwoch dieselbe Strecke.",
      timestamp: "2025-05-26T15:25:00Z",
      read: true
    },
    {
      id: "305",
      senderId: "3",
      receiverId: "current",
      content: "Ich bitte um Rückruf.",
      timestamp: "2025-05-26T15:30:00Z",
      read: false
    }
  ],
  "4": [
    {
      id: "401",
      senderId: "current",
      receiverId: "4",
      content: "Hallo Tim! Ich biete nächste Woche eine Fahrt nach München an. Interesse?",
      timestamp: "2025-05-25T11:05:00Z",
      read: true
    },
    {
      id: "402", 
      senderId: "4",
      receiverId: "current",
      content: "Hey! Das klingt super. An welchem Tag genau?",
      timestamp: "2025-05-25T11:10:00Z",
      read: true
    },
    {
      id: "403",
      senderId: "current",
      receiverId: "4",
      content: "Ich fahre am Donnerstag um 7 Uhr los. Zurück am Sonntag.",
      timestamp: "2025-05-25T11:15:00Z",
      read: true
    },
    {
      id: "404",
      senderId: "4",
      receiverId: "current",
      content: "Passt 16:00 Uhr für dich?",
      timestamp: "2025-05-25T11:20:00Z", 
      read: true
    }
  ],
  "5": [
    {
      id: "501",
      senderId: "5",
      receiverId: "current",
      content: "Hallo! Ich habe gesehen, dass du regelmäßig nach Frankfurt fährst?",
      timestamp: "2025-05-23T09:15:00Z",
      read: true
    },
    {
      id: "502",
      senderId: "current", 
      receiverId: "5",
      content: "Ja, jeden Freitag! Suchst du eine Mitfahrgelegenheit?",
      timestamp: "2025-05-23T09:20:00Z",
      read: true
    },
    {
      id: "503",
      senderId: "5",
      receiverId: "current",
      content: "Genau! Wie viel würde es kosten und hast du noch Plätze frei?",
      timestamp: "2025-05-23T09:25:00Z",
      read: true
    },
    {
      id: "504",
      senderId: "current",
      receiverId: "5",
      content: "15€ pro Person und ja, ich habe noch 2 Plätze frei. Ich fahre immer vom Hauptbahnhof aus um 16 Uhr.",
      timestamp: "2025-05-23T09:30:00Z",
      read: true
    },
    {
      id: "505",
      senderId: "5",
      receiverId: "current",
      content: "Super, danke für die Info!",
      timestamp: "2025-05-23T09:35:00Z",
      read: true
    }
  ]
};

// Abrufen aller Chat-Kontakte
export async function fetchChatContacts(): Promise<ChatContact[]> {
  // Simuliere API-Aufruf mit Verzögerung
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockContacts);
    }, 500);
  });
}

// Abrufen des Chat-Verlaufs mit einem bestimmten Kontakt
export async function fetchChatHistory(contactId: string): Promise<ChatMessage[]> {
  // Simuliere API-Aufruf mit Verzögerung
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[contactId] || []);
    }, 700);
  });
}

// Senden einer neuen Nachricht
export async function sendChatMessage(receiverId: string, content: string): Promise<ChatMessage> {
  // Simuliere API-Aufruf mit Verzögerung
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: `new-${Date.now()}`,
        senderId: "current",
        receiverId: receiverId,
        content: content,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Füge die Nachricht zu den Mock-Daten hinzu (optional)
      if (mockMessages[receiverId]) {
        mockMessages[receiverId].push(newMessage);
      } else {
        mockMessages[receiverId] = [newMessage];
      }
      
      resolve(newMessage);
    }, 300);
  });
}

// WebSocket-Verbindung für Echtzeit-Nachrichten
export function subscribeToMessages(onMessageReceived: (message: ChatMessage) => void) {
  // Simuliere eingehende Nachrichten alle 30 Sekunden
  const interval = setInterval(() => {
    // Zufälligen Kontakt auswählen
    const randomContactId = String(Math.floor(Math.random() * 5) + 1);
    
    const mockNewMessage: ChatMessage = {
      id: `mock-${Date.now()}`,
      senderId: randomContactId,
      receiverId: "current",
      content: "Neue automatische Nachricht zur Demonstration der Echtzeit-Funktion!",
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Füge die Nachricht zu den Mock-Daten hinzu
    if (mockMessages[randomContactId]) {
      mockMessages[randomContactId].push(mockNewMessage);
    }
    
    onMessageReceived(mockNewMessage);
  }, 30000); // Alle 30 Sekunden
  
  // Funktion zum Bereinigen
  return () => {
    clearInterval(interval);
  };
}