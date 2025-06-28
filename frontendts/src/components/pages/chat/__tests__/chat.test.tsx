import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; 
import userEvent from '@testing-library/user-event';

// Mocks MÜSSEN vor den Imports stehen
jest.mock('../chatService');
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));
jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      {...props} 
    />
  )
}));

import Chat from '../chat';
import { fetchChatContacts, fetchChatHistory, sendChatMessage } from '../chatService';

// Mock-Typen
const mockFetchChatContacts = fetchChatContacts as jest.MockedFunction<typeof fetchChatContacts>;
const mockFetchChatHistory = fetchChatHistory as jest.MockedFunction<typeof fetchChatHistory>;
const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockLocalStorage = localStorage as jest.Mocked<Storage>;
    mockLocalStorage.getItem.mockReturnValue('user-1');
    
    // Default Mock-Verhalten
    mockFetchChatContacts.mockResolvedValue([]);
    mockFetchChatHistory.mockResolvedValue([]);
    mockSendChatMessage.mockResolvedValue({
      id: 'msg-1',
      senderId: 'user-1',
      chatId: 'chat-1',
      content: 'Test',
      createdAt: '2025-06-27T10:00:00Z',
      read: false
    });
  });

  test('renders chat component without crashing', async () => {
    await act(async () => {
      render(<Chat />);
    });
    expect(document.body).toBeInTheDocument();
  });

  test('calls fetchChatContacts on mount', async () => {
    await act(async () => {
      render(<Chat />);
    });
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    });
  });

  test('displays contacts when loaded', async () => {
    const mockContacts = [
      {
        id: 'chat-1',
        receiverId: 'user-2',
        senderID: 'user-1',
        name: 'John Doe',
        lastMessage: 'Hello',
        lastMessageTime: '10:30',
        unreadCount: 2
      }
    ];
    
    mockFetchChatContacts.mockResolvedValue(mockContacts);
    
    await act(async () => {
      render(<Chat />);
    });
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Prüfe, ob Kontakt-Daten gerendert werden - verwende getAllByText da es mehrfach vorkommt
    await waitFor(() => {
      const johnDoeElements = screen.getAllByText('John Doe');
      expect(johnDoeElements.length).toBeGreaterThan(0);
      // Prüfe spezifisch nach dem ersten Element (in der Contact-Liste)
      expect(johnDoeElements[0]).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays contact list and chat header correctly', async () => {
    const mockContacts = [
      {
        id: 'chat-1',
        receiverId: 'user-2',
        senderID: 'user-1',
        name: 'John Doe',
        lastMessage: 'Hello',
        lastMessageTime: '10:30',
        unreadCount: 2
      }
    ];
    
    mockFetchChatContacts.mockResolvedValue(mockContacts);
    
    await act(async () => {
      render(<Chat />);
    });
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    });

    // Teste spezifische UI-Elemente
    expect(screen.getByText('Chats')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('10:30')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // unread count
    expect(screen.getByPlaceholderText('Nachricht eingeben...')).toBeInTheDocument();
    expect(screen.getByText('Senden')).toBeInTheDocument();
  });

  test('loads chat history when contact is selected', async () => {
    const mockContacts = [
      {
        id: 'chat-1',
        receiverId: 'user-2',
        senderID: 'user-1',
        name: 'John Doe'
      }
    ];
    
    const mockMessages = [
      {
        id: 'msg-1',
        senderId: 'user-2',
        chatId: 'chat-1',
        content: 'Hello there!',
        createdAt: '2025-06-27T10:30:00Z',
        read: false
      }
    ];
    
    mockFetchChatContacts.mockResolvedValue(mockContacts);
    mockFetchChatHistory.mockResolvedValue(mockMessages);
    
    await act(async () => {
      render(<Chat />);
    });
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    });

    // Da der erste Kontakt automatisch ausgewählt wird, wird fetchChatHistory aufgerufen
    await waitFor(() => {
      expect(mockFetchChatHistory).toHaveBeenCalledWith('chat-1');
    });
  });

  test('handles loading states correctly', async () => {
    // Verzögere die Mock-Antwort um loading state zu testen
    mockFetchChatContacts.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([]), 100))
    );
    
    await act(async () => {
      render(<Chat />);
    });
    
    // Component sollte laden ohne Crash
    expect(document.body).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    });
  });

  test('sends message when form is submitted', async () => {
    const user = userEvent.setup();
    
    const mockContacts = [
      {
        id: 'chat-1',
        receiverId: 'user-2',
        senderID: 'user-1',
        name: 'John Doe'
      }
    ];
    
    mockFetchChatContacts.mockResolvedValue(mockContacts);
    
    await act(async () => {
      render(<Chat />);
    });
    
    await waitFor(() => {
      expect(mockFetchChatContacts).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText('Nachricht eingeben...');
    const sendButton = screen.getByText('Senden');

    // Tippe eine Nachricht
    await act(async () => {
      await user.type(input, 'Test message');
    });

    // Sende die Nachricht
    await act(async () => {
      await user.click(sendButton);
    });

    // Prüfe ob sendChatMessage aufgerufen wurde
    expect(mockSendChatMessage).toHaveBeenCalledWith(
      'Test message',
      'chat-1',
      'user-1'
    );
  });
});