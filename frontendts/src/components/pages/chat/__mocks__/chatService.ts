import type { ChatContact, ChatMessage } from '../chatService';

export const mockChatContacts: ChatContact[] = [
  {
    id: 'chat-1',
    receiverId: 'user-2',
    senderID: 'user-1',
    name: 'John Doe',
    avatar: 'avatar1.jpg',
    lastMessage: 'Hello there!',
    lastMessageTime: '10:30',
    unreadCount: 2
  },
  {
    id: 'chat-2',
    receiverId: 'user-3', 
    senderID: 'user-1',
    name: 'Jane Smith',
    lastMessage: 'See you later',
    lastMessageTime: '09:15',
    unreadCount: 0
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    chatId: 'chat-1',
    content: 'Hello there!',
    createdAt: '2025-06-27T10:30:00Z',
    read: false
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    chatId: 'chat-1', 
    content: 'Hi! How are you?',
    createdAt: '2025-06-27T10:31:00Z',
    read: false
  }
];

export const fetchChatContacts = jest.fn(() => Promise.resolve(mockChatContacts));
export const fetchChatHistory = jest.fn(() => Promise.resolve(mockMessages));
export const sendChatMessage = jest.fn(() => Promise.resolve(mockMessages[0]));
export const subscribeToMessages = jest.fn(() => Promise.resolve(() => {}));
export const transformMessages = jest.fn((msgs) => msgs);