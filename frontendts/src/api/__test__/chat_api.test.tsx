import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    createChat,
    postMessage,
    getChats,
    getChatMessages,
    connectWebSocket,
    connectTrackingWebSocket,
} from '@/api/chat_api.tsx'; // Pfad anpassen

describe('API-Funktionen', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock-Adapter für axios
        mock = new MockAdapter(axios);
        // Session Storage mocken
        sessionStorage.setItem('token', 'testToken123');
    });

    afterEach(() => {
        mock.restore();
        sessionStorage.clear();
    });

    test('createChat ruft API mit userIds auf und gibt Daten zurück', async () => {
        const userIds = ['user1', 'user2'];
        const mockResponse = { chatId: 'abc123' };
        mock.onPost('/api/chat', { userIds }).reply(200, mockResponse);

        const result = await createChat(userIds);
        expect(result).toEqual(mockResponse);
    });

    test('postMessage sendet Nachricht und gibt Antwort zurück', async () => {
        const chatId = 'chat123';
        const content = 'Hallo Welt';
        const mockResponse = { messageId: 'msg456' };
        mock.onPost(`/api/chat/${chatId}`, { content }).reply(200, mockResponse);

        const result = await postMessage(chatId, content);
        expect(result).toEqual(mockResponse);
    });

    test('getChats ruft alle Chats ab', async () => {
        const mockChats = [{ id: 'chat1' }, { id: 'chat2' }];
        mock.onGet('/api/chat').reply(200, mockChats);

        const result = await getChats();
        expect(result).toEqual(mockChats);
    });

    test('getChatMessages ruft Nachrichten eines Chats ab', async () => {
        const chatId = 'chat123';
        const messages = [{ id: 'msg1' }, { id: 'msg2' }];
        mock.onGet(`/api/chat/${chatId}`).reply(200, messages);

        const result = await getChatMessages(chatId);
        expect(result).toEqual(messages);
    });

    test('connectWebSocket erstellt WebSocket mit Token', () => {
        // Mock sessionStorage
        sessionStorage.setItem('token', 'wsToken');
        const chatId = 'abc123';

        const socket = connectWebSocket(chatId);
        expect(socket).toBeInstanceOf(WebSocket);
        expect(socket.url).toBe(`api/ws/chat/${chatId}?token=wsToken`);
    });

    test('connectTrackingWebSocket erstellt WebSocket mit Token', () => {
        sessionStorage.setItem('token', 'trackingToken');

        const socket = connectTrackingWebSocket();
        expect(socket).toBeInstanceOf(WebSocket);
        expect(socket.url).toBe(`/api/tracking?token=trackingToken`);
    });
});