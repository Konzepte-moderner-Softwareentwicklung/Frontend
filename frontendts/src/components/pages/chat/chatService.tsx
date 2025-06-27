import axios from "axios";
import {getChats, getChatMessages, connectWebSocket, postMessage} from "@/api/chat_api";
import {getUserByID} from "@/api/user_api.tsx";

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

function findLatestMessage(messages: ChatMessage[]): ChatMessage | null {
  if (messages.length === 0) return null;

  return messages.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
  });
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
// 🔹 Abrufen aller Chat-Kontakte
export async function fetchChatContacts(){

  try {
    const userID = localStorage.getItem("UserID");
    const contacts:ChatContact[] = [];

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
              newContact.lastMessage = lastMessage?.content;
              newContact.lastMessageTime = lastMessage?.createdAt;
            }

            const otherUser = await getUserByID(otherUid);
            newContact.name = otherUser.firstName + " " + otherUser.lastName;
            newContact.avatar = otherUser.profilePicture;
            if(!(contacts.find(str => str.id === newContact.id))) {
              contacts.push(newContact);
            }
            else{
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
  };

  return () => socket.close();
}
