import {
    getChats,
    getChatMessages,
    connectWebSocket,
    postMessage,
    connectTrackingWebSocket,
    createChat
} from "@/api/chat_api";
import {getUserByID} from "@/api/user_api.tsx";

export async function createIfNotExistChat(userID:string) {
  if(!(contacts.find(contact => contact.receiverId === userID || contact.senderID === userID))){
    await createChat([userID]);
  }
}


// Interfaces
export interface ChatContact {
  id: string;
  receiverId: string;
  senderID: string; // Gegenüber im Chat
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

export interface LiveLocationUpdate {
  location: {
    lat: number;
    lon: number;
  };
}







function findLatestMessage(messages: ChatMessage[]): ChatMessage | null {
  let latest: ChatMessage | null = null;
  let latestTime = -Infinity;

  for (const message of messages) {
    const time = Date.parse(message.createdAt);
    if (!isNaN(time) && time > latestTime) {
      latest = message;
      latestTime = time;
    }
  }
  console.log(latest?.createdAt);
  return latest;
}

export function transformMessages(messages: any[]): ChatMessage[] {
  if(messages.length > 0) {
    return messages.map((message) => {
      try {
        const newMessage: ChatMessage = {
          id: message.id,
          chatId: message.chat_id,
          senderId: message.sender_id,
          content: message.content,
          createdAt: message.created_at,
          read: false,
        };
        return newMessage;
      } catch (error) {
        console.error("Failed to transform message:", error);
        return null; // optional: du kannst auch `undefined` zurückgeben oder filtern
      }
    }).filter((msg): msg is ChatMessage => msg !== null);

  }
  else return [];
}


function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ""; // Fehlerfall

  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const contacts:ChatContact[] = [];

// 🔹 Abrufen aller Chat-Kontakte
export async function fetchChatContacts(){

  try {
    const userID = sessionStorage.getItem("UserID");


    const chats = await getChats();
    if(chats) {
      for (const chat of chats) {
        const newContact: ChatContact = {};
        if (chat.user_ids.length === 2) {
          //einzelchat

          const userIDs: string[] = chat.user_ids;
          const otherUid = userIDs.find(id => id !== userID);


          const chatID = chat.id;
          if (otherUid && userID && chat.id) {
            newContact.receiverId = otherUid;
            newContact.senderID = userID;
            newContact.id = chatID;
            const rawMessages = await getChatMessages(chatID);
            if (rawMessages) {
              //es gibt bereits nachrichten
              //todo: handler für lastMessage = null
              const messages = transformMessages(rawMessages);
              const lastMessage = findLatestMessage(messages)
              if(lastMessage){
                newContact.lastMessage = lastMessage.content;
                newContact.lastMessageTime = formatMessageDate(lastMessage.createdAt);

              }
            }

            const otherUser = await getUserByID(otherUid);
            newContact.name = otherUser.firstName + " " + otherUser.lastName;
            newContact.avatar = otherUser.profilePicture;
            if(!(contacts.find(str => str.id === newContact.id))) {
              contacts.push(newContact);
            }

          }

        } else if (chat.user_ids.length > 2) {
          //gruppenchat
        }
      }
    }


    return contacts;
  } catch (err) {
    console.error("Fehler beim Laden der Kontakte:", err);
  }
}

// 🔹 Abrufen des Chat-Verlaufs
export async function fetchChatHistory(id:string): Promise<ChatMessage[]> {
      const rawMessages = await getChatMessages(id);
      if (rawMessages) {
        const messages = transformMessages(rawMessages);
        return messages;
      }
      return [];


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
  const res = await postMessage(chatID, content);

  if(res)return newMessage;

}




export async function subscribeToMessages(
    chatId: string,
    onMessageReceived: (msg: ChatMessage) => void
): Promise<() => void> {
const socket = await connectWebSocket(chatId);
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
    subscribeToMessages(chatId,onMessageReceived)
  };

  return () => socket.close();
}


export async function subscribeToLiveLocations(
    onLocationReceived: (update: LiveLocationUpdate) => void
): Promise<WebSocket> {

  const socket = await connectTrackingWebSocket();


  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as LiveLocationUpdate;
      console.log(JSON.stringify(data))
      onLocationReceived(data);

    } catch (err) {
      console.error("Fehler beim Parsen des Tracking-Updates:", err);
    }
  };

  socket.onerror = (err) => {
    console.error("Tracking-WebSocket-Fehler:", err);
  };

  socket.onclose = () => {
    console.log("Tracking-WS getrennt");
  };

  return socket;
}






