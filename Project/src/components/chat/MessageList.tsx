import { useState, useRef } from 'react';
import { Message } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { formatTime } from '../../utils/dateUtils';
import { Smile, Check, CheckCheck, Image, File, Mic, X } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = message.timestamp.toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-indigo-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <span className="text-xs text-gray-600 dark:text-gray-300">{date}</span>
            </div>
          </div>
          
          {dateMessages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isCurrentUser={message.senderId === currentUserId}
              showAvatar={index === 0 || dateMessages[index - 1].senderId !== message.senderId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
            <Smile className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            No messages yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Send a message to start the conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageList;