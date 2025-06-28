import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  fetchChatContacts,
  fetchChatHistory,
  sendChatMessage,
  subscribeToMessages,
  transformMessages,
  type ChatContact,
  type ChatMessage,
  startLiveLocationBroadcast,
  subscribeToLiveLocations
} from "./chatService";

export default function Chat() {
  // State für Kontakte und Chat
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userID] = useState<string>(sessionStorage.getItem("UserID") || "");
  const [liveLocationMessageId, setLiveLocationMessageId] = useState<string | null>(null);
  const [trackingSocket, setTrackingSocket] = useState<WebSocket | null>(null);

  interface ChatMapProps {
    lat: number;
    lon: number;
    maptilerKey: string;
  }


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
        for(const msg of data){
          console.log("senderID "+ msg.senderId+"    userID: "+sessionStorage.getItem("UserID"));
        }
        setMessages(data);
        debugger;
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



  useEffect(() => {
    if (!selectedContact) return;

    let isSubscribed = true;
    let socketCleanup = () => {};


    const subscribe = async () => {
      try {
        const unsubscribe = await subscribeToMessages(selectedContact.id, async (newMsg) => {
          if (!isSubscribed) return;

         if (newMsg.senderId === selectedContact.receiverId) {
            newMsg = transformMessages([newMsg])[0]
            setMessages((prev) => [...prev, newMsg]);
         }

          const data = await fetchChatHistory(selectedContact.id);

          setMessages(data);

          setContacts((prev) =>
              prev.map((contact) => {
                if (
                    contact.receiverId === newMsg.senderId &&
                    contact.receiverId !== selectedContact.receiverId &&
                    newMsg.createdAt &&
                    !isNaN(Date.parse(newMsg.createdAt))
                ) {
                  return {
                    ...contact,
                    unreadCount: (contact.unreadCount || 0) + 1,
                    lastMessage: newMsg.content,
                    lastMessageTime: newMsg.createdAt,
                  };
                }
                return contact;

              })

        );
        });

        socketCleanup = unsubscribe;
      } catch (err) {
        console.error("WebSocket Subscribe-Fehler:", err);
      }
    };

    subscribe();

    return () => {
      isSubscribed = false;
      socketCleanup?.(); // ✅ kann wieder rein!
    };
  }, [selectedContact?.id]); // 👈 Nur neu subscriben, wenn die Chat-ID sich ändert


  // Absenden einer neuen Nachricht
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContact || !newMessage.trim()) return;
    setIsLoading(true);

    try {
      // Optimistisches Update: Nachricht sofort anzeigen

      const tempMessage: ChatMessage = {
        id: `temp-${crypto.randomUUID()}`,
        senderId: userID, // Aktuelle Benutzer-ID
        chatId: selectedContact.id,
        content: newMessage,
        createdAt: new Date().toISOString(),
        read: false
      };
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      // Tatsächlich an Backend senden
      const sentMessage = await sendChatMessage(newMessage, selectedContact.id,userID);
      if(sentMessage){
        // Optimistisches Update mit tatsächlicher Nachricht ersetzen
        setMessages((prev) =>

            prev.map((msg) => msg.id === tempMessage.id ? sentMessage : msg)
        );
      }


      // Kontaktliste aktualisieren
      setContacts((prev) =>
        prev.map((contact) => {
          if (contact.receiverId === selectedContact.receiverId) {
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
        if (c.receiverId === contact.receiverId) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  };




/*
  Wir verwenden einen maptiler API key.
  bis zu 100.000 Tile Requests pro Monat sind gratis
  später kann man noch upgraden
 */
  function ChatMap({ maptilerKey,lat,lon }: ChatMapProps) {
    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <MapContainer
              center={[lat, lon]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
          >
            <TileLayer
                url={`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${maptilerKey}`}
                attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            />
            <Marker position={[lat, lon]}>
              <Popup>Standort</Popup>
            </Marker>
          </MapContainer>
        </div>
    );
  }


  const handleStartLiveLocation = async () => {
    if (!selectedContact) return;

    let currentId = liveLocationMessageId;

    if (!currentId) {
      currentId = `live-${crypto.randomUUID()}`;
      const newMessage: ChatMessage = {
        id: currentId,
        senderId: userID,
        chatId: selectedContact.id,
        content: JSON.stringify([0, 0]),
        createdAt: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [...prev, newMessage]);
      setLiveLocationMessageId(currentId);
    }

    if (!trackingSocket) {
      const socket = await subscribeToLiveLocations((update) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === currentId
                    ? { ...msg, content: JSON.stringify([update.location.lat, update.location.lon]) }
                    : msg
            )
        );
      });
      setTrackingSocket(socket);

      startLiveLocationBroadcast(socket);
    }
  };



  function isLocation(content: unknown): content is [number, number] {
    return (
        Array.isArray(content) &&
        content.length === 2 &&
        typeof content[0] === 'number' &&
        typeof content[1] === 'number'
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-4rem)] flex">
      {/* Kontaktliste (1/4 der Breite) */}
      <div className="w-1/4 border-r border-gray-200 pr-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>

        {contacts.length === 0 && !isLoading ? (
          <div className="text-gray-500 text-center">Keine Chats gefunden</div>
        ) : (
          <ul>
            {
              contacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition ${
                  selectedContact?.id === contact.id ? "bg-gray-100" : ""
                }`
            }


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
            <div className="flex items-center justify-between py-3 px-4 border-b">
              <div className="flex items-center">
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
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                  <button
                      onClick={handleStartLiveLocation}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    📍 Standort teilen
                  </button>
                </div>
              </div>
            </div>
            {/* Nachrichten-Bereich */}
            <div className="flex-grow overflow-y-auto px-4 py-3">
              {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((message: ChatMessage) => {
                    const location = isLocation(message.content);
debugger;
                    return (
                        <div
                            key={message.id}
                            className={`mb-4 flex ${
                                message.senderId === userID ? "justify-end" : "justify-start"
                            }`}
                        >
                          <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  message.senderId === userID
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-800"
                              }`}
                          >
                            {location ? (
                                <ChatMap lat={50.123} lon={8.678} maptilerKey="vkU8ScE7aTGgHihSlzzK" />
                            ) : (
                                <p>{message.content}</p>
                            )}                            <div
                                className={`text-xs mt-1 ${
                                    message.senderId === userID ? "text-blue-100" : "text-gray-500"
                                }`}
                            >
                              {formatMessageDate(message.createdAt)}
                            </div>
                          </div>
                        </div>
                    );
                  })
              ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Beginne einen Chat mit {selectedContact?.name ?? "jemandem"}
                  </div>
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


