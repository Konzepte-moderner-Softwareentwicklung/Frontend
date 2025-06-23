
import { useEffect, useRef, useState } from 'react';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('WebSocket verbunden');
        };

        ws.current.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket-Fehler:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket getrennt');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send('Hallo Server!');
        }
    };

    return (
        <div className="p-4 bg-white mt-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">WebSocket Nachrichten</h2>
            <button onClick={sendMessage} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                Nachricht senden
            </button>
            <ul className="list-disc pl-6">
                {messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
