import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './AuthContext';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { emoji: string; userId: string }[];
  attachments?: {
    id: string;
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
}

export interface Chat {
  id: string;
  type: 'individual' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: { userId: string; name: string };
  avatar?: string;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string, attachments?: any[]) => void;
  markAsRead: (chatId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  setTypingStatus: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'online'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'offline'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'away'
  },
  {
    id: '5',
    name: 'Team Alpha',
    email: 'team-alpha@example.com',
    avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'online'
  }
];

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    type: 'individual',
    participants: [MOCK_USERS[0]],
    unreadCount: 3,
    lastMessage: {
      id: '101',
      content: 'Hey there! How are you doing today?',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered'
    }
  },
  {
    id: '2',
    type: 'individual',
    participants: [MOCK_USERS[1]],
    unreadCount: 0,
    lastMessage: {
      id: '201',
      content: 'Let me know when you\'re free to discuss the project',
      senderId: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'read'
    }
  },
  {
    id: '3',
    type: 'individual',
    participants: [MOCK_USERS[2]],
    unreadCount: 1,
    lastMessage: {
      id: '301',
      content: 'I\'ve sent you the files you requested',
      senderId: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'sent'
    }
  },
  {
    id: '4',
    type: 'group',
    name: 'Team Alpha',
    participants: MOCK_USERS,
    unreadCount: 5,
    lastMessage: {
      id: '401',
      content: 'Has everyone reviewed the latest updates?',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'delivered'
    },
    avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const MOCK_MESSAGES: { [key: string]: Message[] } = {
  '1': [
    {
      id: '101',
      content: 'Hey there! How are you doing today?',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'read'
    },
    {
      id: '102',
      content: 'I\'m doing great! Thanks for asking. How about you?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      status: 'read'
    },
    {
      id: '103',
      content: 'Pretty good! Just working on that new project we discussed.',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      status: 'read'
    },
    {
      id: '104',
      content: 'Check out this design I made!',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
      status: 'read',
      attachments: [
        {
          id: 'a1',
          type: 'image',
          url: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          name: 'design_concept.jpg',
          size: 1024000
        }
      ]
    },
    {
      id: '105',
      content: 'This looks amazing! I love the color scheme.',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
      status: 'read',
      reactions: [
        { emoji: '👍', userId: '1' },
        { emoji: '❤️', userId: '2' }
      ]
    },
    {
      id: '106',
      content: 'Thanks! I spent a lot of time on it.',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered'
    }
  ]
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (activeChat) {
      // In a real app, this would fetch messages from an API
      setMessages(MOCK_MESSAGES[activeChat.id] || []);
      
      // Mark messages as read when opening a chat
      if (activeChat.unreadCount > 0) {
        markAsRead(activeChat.id);
      }
    }
  }, [activeChat]);

  const sendMessage = (content: string, attachments?: any[]) => {
    if (!activeChat || !content.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: '1', // Current user ID
      timestamp: new Date(),
      status: 'sent',
      attachments: attachments ? attachments.map((att, i) => ({
        id: `att-${Date.now()}-${i}`,
        type: att.type,
        url: att.url,
        name: att.name,
        size: att.size
      })) : undefined
    };
    
    // Update messages in the current chat
    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chats list
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
    
    // In a real app, this would send the message to the server
    // Simulate message being delivered after a short delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);
  };

  const markAsRead = (chatId: string) => {
    // Update unread count in chat list
    setChats(prev => prev.map(chat => 
      chat.id === chatId
        ? { ...chat, unreadCount: 0 }
        : chat
    ));
    
    // Update message status
    setMessages(prev => 
      prev.map(msg => 
        msg.status !== 'read'
          ? { ...msg, status: 'read' }
          : msg
      )
    );
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          // Remove existing reaction from the same user if any
          const filteredReactions = reactions.filter(r => r.userId !== '1');
          return {
            ...msg,
            reactions: [...filteredReactions, { emoji, userId: '1' }]
          };
        }
        return msg;
      })
    );
  };

  const setTypingStatus = (isTyping: boolean) => {
    if (!activeChat) return;
    
    // In a real app, this would notify the server about typing status
    // Here we'll just simulate receiving a typing notification
    if (isTyping) {
      setTimeout(() => {
        setChats(prev => prev.map(chat => 
          chat.id === activeChat.id
            ? { 
                ...chat, 
                isTyping: {
                  userId: activeChat.participants[0].id,
                  name: activeChat.participants[0].name
                }
              }
            : chat
        ));
        
        // Clear typing indicator after a few seconds
        setTimeout(() => {
          setChats(prev => prev.map(chat => 
            chat.id === activeChat.id
              ? { ...chat, isTyping: undefined }
              : chat
          ));
        }, 3000);
      }, 500);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      messages,
      setActiveChat,
      sendMessage,
      markAsRead,
      addReaction,
      setTypingStatus
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}