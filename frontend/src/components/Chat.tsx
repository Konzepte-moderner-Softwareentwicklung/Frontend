import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export default function Chat() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const userId = "me";
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: `Willkommen im Chat zu Angebot ${offerId}!` ,
    sender: "user2",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  }]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        sender: userId,
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-green-50 min-h-screen min-w-full">
      <div className="flex items-center p-4 border-b bg-white">
        <Button
          variant="outline"
          className="mr-4 border-green-300 text-green-800 hover:text-green-900 hover:border-green-600"
          onClick={() => navigate('/chats')}
        >
          ← Zurück
        </Button>
        <span className="text-lg font-bold text-green-900">Chat zu Angebot {offerId}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative text-sm break-words
                ${msg.sender === userId
                  ? "bg-green-600 text-white rounded-br-md"
                  : "bg-white text-green-900 border border-green-100 rounded-bl-md"}
              `}
            >
              <div className="mb-1 font-medium text-xs opacity-80">
                {msg.sender === userId ? "Du" : msg.sender}
              </div>
              <div>{msg.content}</div>
              <div className="text-xs text-right mt-1 opacity-60">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t bg-white sticky bottom-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht schreiben..."
          className="flex-1 rounded-full border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-green-50 text-green-900"
        />
        <Button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white rounded-full px-5 py-2 font-semibold shadow"
        >
          Senden
        </Button>
      </form>
    </div>
  );
} 