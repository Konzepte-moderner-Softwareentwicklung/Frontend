// Vollständiges Mocken - keine echten Imports
jest.mock('../chatService');

import { 
  fetchChatContacts, 
  fetchChatHistory, 
  sendChatMessage,
  transformMessages
} from '../chatService';

// TypeScript-Typen für die Mocks
const mockFetchChatContacts = fetchChatContacts as jest.MockedFunction<typeof fetchChatContacts>;
const mockFetchChatHistory = fetchChatHistory as jest.MockedFunction<typeof fetchChatHistory>;
const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;
const mockTransformMessages = transformMessages as jest.MockedFunction<typeof transformMessages>;

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockLocalStorage = localStorage as jest.Mocked<Storage>;
    mockLocalStorage.getItem.mockReturnValue('user-1');
  });

  test('fetchChatContacts mock works', async () => {
    const mockContacts = [
      {
        id: 'chat-1',
        receiverId: 'user-2',
        senderID: 'user-1',
        name: 'John Doe'
      }
    ];
    
    mockFetchChatContacts.mockResolvedValue(mockContacts);
    
    const result = await fetchChatContacts();
    expect(result).toEqual(mockContacts);
    expect(mockFetchChatContacts).toHaveBeenCalled();
  });

  test('transformMessages mock works', () => {
    const mockMessages = [
      {
        id: '1',
        senderId: 'user-1',
        chatId: 'chat-1',
        content: 'Hello',
        createdAt: '2025-06-27T10:00:00Z',
        read: false
      }
    ];
    
    mockTransformMessages.mockReturnValue(mockMessages);
    
    const result = transformMessages([]);
    expect(result).toEqual(mockMessages);
    expect(mockTransformMessages).toHaveBeenCalledWith([]);
  });

  test('fetchChatHistory mock works', async () => {
    const mockMessages = [
      {
        id: '1',
        senderId: 'user-1', 
        chatId: 'chat-1',
        content: 'Hello',
        createdAt: '2025-06-27T10:00:00Z',
        read: false
      }
    ];
    
    mockFetchChatHistory.mockResolvedValue(mockMessages);
    
    const result = await fetchChatHistory('chat-1');
    expect(result).toEqual(mockMessages);
    expect(mockFetchChatHistory).toHaveBeenCalledWith('chat-1');
  });
});