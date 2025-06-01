import { useTheme } from '../../context/ThemeContext';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { Chat } from '../../context/ChatContext';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

const ChatListItem = ({ chat, isActive, onClick, currentUserId }: ChatListItemProps) => {
  const { theme } = useTheme();
  
  // For individual chats, get the other participant
  const chatName = chat.type === 'individual' 
    ? chat.participants[0].name 
    : chat.name;
  
  const chatAvatar = chat.type === 'individual'
    ? chat.participants[0].avatar
    : chat.avatar;
  
  const isOnline = chat.type === 'individual' && chat.participants[0].status === 'online';
  
  // Message preview logic
  const lastMessageSender = chat.lastMessage?.senderId === currentUserId ? 'You: ' : '';
  const lastMessageContent = chat.lastMessage?.content || '';
  const messagePreview = `${lastMessageSender}${lastMessageContent}`;
  
  // Timestamp formatting
  const timeAgo = chat.lastMessage?.timestamp 
    ? formatDistanceToNow(chat.lastMessage.timestamp)
    : '';

  return (
    <li 
      className={`relative ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
      onClick={onClick}
    >
      <button className="w-full text-left px-4 py-3 focus:outline-none">
        <div className="flex items-start">
          <div className="relative flex-shrink-0">
            <img 
              src={chatAvatar} 
              alt={chatName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-800"></span>
            )}
          </div>
          
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className={`text-sm font-medium truncate ${isActive ? 'text-indigo-800 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                {chatName}
              </h3>
              {timeAgo && (
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{timeAgo}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {chat.isTyping 
                  ? <span className="italic text-indigo-600 dark:text-indigo-400">typing...</span>
                  : messagePreview}
              </p>
              
              {chat.unreadCount > 0 && (
                <span className="ml-1 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
};

export default ChatListItem;