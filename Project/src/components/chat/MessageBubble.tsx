import { useState, useEffect, useRef } from 'react';
import { useChat, Message } from '../../context/ChatContext';
import { formatTime } from '../../utils/dateUtils';
import { Smile, Check, CheckCheck, Image, File, Mic, MoreVertical } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  currentUserId: string;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const MessageBubble = ({ message, isCurrentUser, showAvatar, currentUserId }: MessageBubbleProps) => {
  const { addReaction } = useChat();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleEmojiClick = (emoji: string) => {
    addReaction(message.id, emoji);
    setShowEmojiPicker(false);
  };
  
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
  
  // Handle file attachments display
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map(attachment => {
          if (attachment.type === 'image') {
            return (
              <div key={attachment.id} className="rounded-lg overflow-hidden">
                <img 
                  src={attachment.url} 
                  alt={attachment.name} 
                  className="w-full max-h-80 object-contain bg-gray-100 dark:bg-gray-700"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <span className="truncate">{attachment.name}</span>
                  {attachment.size && (
                    <span className="ml-2">({Math.round(attachment.size / 1024)} KB)</span>
                  )}
                </div>
              </div>
            );
          } else {
            const Icon = attachment.type === 'audio' ? Mic : File;
            return (
              <div 
                key={attachment.id}
                className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
              >
                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                  <Icon size={18} className="text-gray-500 dark:text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  {attachment.size && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(attachment.size / 1024)} KB
                    </p>
                  )}
                </div>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                  Download
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  };
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - only show for first message in a group */}
        {showAvatar && !isCurrentUser ? (
          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mt-1">
            <img 
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 flex-shrink-0"></div>
        )}
        
        {/* Message content */}
        <div className={`relative mx-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          <div
            className={`inline-block rounded-lg px-4 py-2 shadow-sm
              ${isCurrentUser 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'}`}
          >
            <div className="text-sm">{message.content}</div>
            {renderAttachments()}
          </div>
          
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div 
              className={`flex mt-1 space-x-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {message.reactions.map((reaction, index) => (
                <span 
                  key={`${reaction.emoji}-${index}`}
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs border border-gray-200 dark:border-gray-600"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
          
          {/* Time and status */}
          <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.timestamp)}</span>
            {isCurrentUser && getStatusIcon(message.status)}
          </div>
          
          {/* Message options button */}
          <div 
            className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} top-0 -translate-y-1/4 ${isCurrentUser ? '-translate-x-full' : 'translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Smile size={14} />
              </button>
              
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full mb-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 p-1 flex space-x-1 z-10"
                >
                  {EMOJI_LIST.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;