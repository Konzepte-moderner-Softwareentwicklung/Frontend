import axios from "axios";

// Interfaces
export interface ChatContact {
  chatId: string;
  userId: string; // Gegenüber im Chat
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  chatId: string;
  createdAt: string;
  read: boolean;
}




// 🔹 Abrufen aller Chat-Kontakte
export async function fetchChatContacts(){





  try {
    const userID = localStorage.getItem("UserID");
    const token = localStorage.getItem("token");
    let contacts = [];

    console.log(token);
    await axios.post("/api/chat", {
      userIds: ["2ff8ae97-42bb-46b3-8b34-e35ec6dd42f4"]
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const res = await axios.get(`/ws/chat/${userID}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if(res.status !== 200) {
      contacts = res.data;
    }
    else{
      console.log("contacts kein array ");
    }


    return contacts;
  } catch (err) {
    console.error("Fehler beim Laden der Kontakte:", err);
  }
}

// 🔹 Abrufen des Chat-Verlaufs
export async function fetchChatHistory(): Promise<ChatMessage[]> {


  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/ws/chat/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const messages:ChatMessage[] = await res.data as ChatMessage[];
    console.log(messages);
    return messages;
  } catch (err) {
    console.error("Fehler beim Laden des Verlaufs:", err);
    return [];
  }
}

// 🔹 Neue Nachricht senden
export async function sendChatMessage(
    content: string,
    chatID: string,
    senderID: string
): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `new-${Date.now()}`,
    senderId: senderID,
    chatId: chatID,
    content: content,
    createdAt: new Date().toISOString(),
    read: false,
  };

  try {
    const token = localStorage.getItem("token");
    console.log("ws/chat/"+chatID);
    await axios.post(`/ws/chat/${chatID}`, newMessage, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } catch (err) {
    console.error("Fehler beim Senden der Nachricht:", err);
    // TODO: Visuelle Fehlermeldung anzeigen
  }

  return newMessage;
}



export function subscribeToMessages(
    chatId: string,
    onMessageReceived: (msg: ChatMessage) => void
): () => void {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = "localhost:80";
  const token = localStorage.getItem("token");
  const socket = new WebSocket(`${protocol}://${host}/ws/chat/${chatId}?token=${token}`);
  console.log(`socket: ${protocol}://${host}/ws/chat/${chatId}?token=${token}`)
  socket.onopen = () => {
    console.log("✅ WebSocket verbunden:", chatId);
  };

  socket.onmessage = (event) => {
    try {
      const msg: ChatMessage = JSON.parse(event.data);
      onMessageReceived(msg);
    } catch (err) {
      console.error("Fehler beim Parsen:", err);
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket-Fehler:", err);
  };

  socket.onclose = () => {
    console.log("WebSocket getrennt:", chatId);
  };

  return () => socket.close();
}
