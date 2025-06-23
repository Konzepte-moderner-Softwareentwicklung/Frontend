import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { 
  fetchChatContacts, 
  fetchChatHistory, 
  sendChatMessage, 
  subscribeToMessages,
  type ChatContact, 
  type ChatMessage 
} from "./chatService.tsx";

export default function Chat() {
  // State für Kontakte und Chat
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref für das Scrollen zum Ende des Chats
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Laden der Kontakte beim ersten Render
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChatContacts();
        setContacts(data);
        
        // Optional: Ersten Kontakt automatisch auswählen
        if (data.length > 0 && !selectedContact) {
          setSelectedContact(data[0]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContacts();
  }, []);
  
  // Laden des Chat-Verlaufs, wenn ein Kontakt ausgewählt wird
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!selectedContact) return;
      
      setIsLoading(true);
      try {
        const data = await fetchChatHistory(selectedContact.id);
        setMessages(data);
      } catch (error) {
        console.error("Fehler beim Laden des Chat-Verlaufs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChatHistory();
  }, [selectedContact]);
  
  // Scrollen zum neuesten Nachrichten, wenn Nachrichten geladen werden oder sich ändern
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Abonnieren von neuen Nachrichten über WebSockets/NATS
  useEffect(() => {
    // Abonnieren von Nachrichten
    const unsubscribe = subscribeToMessages((newMsg) => {
      // Prüfen, ob die Nachricht zum aktuellen Chat gehört
      if (selectedContact && 
          (newMsg.senderId === selectedContact.id || 
           newMsg.receiverId === selectedContact.id)) {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      }
      
      // Aktualisiere ungelesene Nachrichten im Kontakt-Liste
      setContacts((prevContacts) => 
        prevContacts.map((contact) => {
          if (contact.id === newMsg.senderId && contact.id !== selectedContact?.id) {
            return {
              ...contact,
              unreadCount: (contact.unreadCount || 0) + 1,
              lastMessage: newMsg.content,
              lastMessageTime: formatTime(new Date(newMsg.timestamp))
            };
          }
          return contact;
        })
      );
    });
    
    // Cleanup beim Unmount
    return () => {
      unsubscribe();
    };
  }, [selectedContact]);
  
  // Absenden einer neuen Nachricht
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact || !newMessage.trim()) return;
    
    setIsLoading(true);
    try {
      // Optimistisches Update: Nachricht sofort anzeigen
      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        senderId: "current", // Aktuelle Benutzer-ID
        receiverId: selectedContact.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      
      // Tatsächlich an Backend senden
      const sentMessage = await sendChatMessage(selectedContact.id, newMessage);
      
      // Optimistisches Update mit tatsächlicher Nachricht ersetzen
      setMessages((prev) => 
        prev.map((msg) => msg.id === tempMessage.id ? sentMessage : msg)
      );
      
      // Kontaktliste aktualisieren
      setContacts((prev) =>
        prev.map((contact) => {
          if (contact.id === selectedContact.id) {
            return {
              ...contact,
              lastMessage: newMessage,
              lastMessageTime: formatTime(new Date())
            };
          }
          return contact;
        })
      );
      
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
      // Optional: Fehlgeschlagene Nachricht markieren oder entfernen
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hilfsfunktion zum Formatieren der Uhrzeit
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Hilfsfunktion zum Formatieren des Datums
  const formatMessageDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + formatTime(date);
  };
  
  // Markieren von Kontakt als ausgewählt
  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
    
    // Ungelesene Nachrichten zurücksetzen
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contact.id) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  };
  
  return (
    <div className="p-4 h-[calc(100vh-4rem)] flex">
      {/* Kontaktliste (1/4 der Breite) */}
      <div className="w-1/4 border-r border-gray-200 pr-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        
        {contacts.length === 0 && !isLoading ? (
          <div className="text-gray-500 text-center">Keine Chats gefunden</div>
        ) : (
          <ul>
            {contacts.map((contact) => (
              <li 
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition ${
                  selectedContact?.id === contact.id ? "bg-gray-100" : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  {contact.avatar ? (
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">
                      {contact.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Kontaktinfo */}
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between">
                    <span className="font-semibold">{contact.name}</span>
                    <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {contact.lastMessage}
                    </p>
                    
                    {/* Ungelesene Nachrichten */}
                    {contact.unreadCount ? (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Chat-Bereich (3/4 der Breite) */}
      <div className="w-3/4 pl-4 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header mit Kontaktinfo */}
            <div className="flex items-center py-3 px-4 border-b">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                {selectedContact.avatar ? (
                  <img 
                    src={selectedContact.avatar} 
                    alt={selectedContact.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">
                    {selectedContact.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
            </div>
            
            {/* Nachrichten-Bereich */}
            <div className="flex-grow overflow-y-auto px-4 py-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Beginne einen Chat mit {selectedContact.name}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderId === "current" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === "current"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${
                        message.senderId === "current" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {formatMessageDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Eingabebereich */}
            <form onSubmit={handleSendMessage} className="pt-3 px-4 border-t">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Nachricht eingeben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isLoading}
                >
                  Senden
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Wähle einen Chat aus, um Nachrichten anzuzeigen
          </div>
        )}
      </div>
    </div>
  );
}