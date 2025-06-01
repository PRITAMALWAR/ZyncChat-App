import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChatHeader from '../components/chat/ChatHeader';
import EmptyState from '../components/chat/EmptyState';

const ChatPage = () => {
  const { activeChat, messages, sendMessage, setTypingStatus } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (message && !isComposing) {
      setIsComposing(true);
      setTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isComposing) {
        setIsComposing(false);
        setTypingStatus(false);
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isComposing, setTypingStatus]);

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      sendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
      setIsComposing(false);
      setTypingStatus(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newAttachments = Array.from(files).map(file => {
      const fileType = file.type.split('/')[0];
      let type: 'image' | 'video' | 'audio' | 'file' = 'file';
      
      if (fileType === 'image') type = 'image';
      else if (fileType === 'video') type = 'video';
      else if (fileType === 'audio') type = 'audio';
      
      const url = type === 'image' 
        ? 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        : '#';
        
      return {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        url,
        name: file.name,
        size: file.size
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div className="h-full flex">
      {/* Chat sidebar */}
      <ChatSidebar />

      {/* Chat main area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
        {activeChat ? (
          <>
            <ChatHeader chat={activeChat} />
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <MessageList 
                messages={messages} 
                currentUserId={user?.id || ''} 
              />
              <div ref={messageEndRef}></div>
            </div>
            
            <MessageInput
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              onFileUpload={handleFileUpload}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ChatPage;