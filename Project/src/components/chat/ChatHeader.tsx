import { useAuth } from '../../context/AuthContext';
import { Chat } from '../../context/ChatContext';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { user } = useAuth();
  
  const chatName = chat.type === 'individual' 
    ? chat.participants[0].name 
    : chat.name;
    
  const chatAvatar = chat.type === 'individual'
    ? chat.participants[0].avatar
    : chat.avatar;
  
  const statusText = chat.type === 'individual' 
    ? chat.participants[0].status === 'online'
      ? 'Online'
      : chat.participants[0].status === 'away'
        ? 'Away'
        : 'Offline'
    : `${chat.participants.length} members`;
  
  const statusColor = chat.type === 'individual'
    ? chat.participants[0].status === 'online'
      ? 'bg-green-500'
      : chat.participants[0].status === 'away'
        ? 'bg-yellow-500'
        : 'bg-gray-500'
    : '';

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex-shrink-0 relative">
          <img 
            src={chatAvatar} 
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {chat.type === 'individual' && (
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${statusColor} border-2 border-white dark:border-gray-800`}></span>
          )}
        </div>
        
        <div className="ml-3">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">{chatName}</h2>
          <div className="flex items-center">
            {chat.type === 'individual' && statusColor && (
              <span className={`w-2 h-2 ${statusColor} rounded-full mr-1.5`}></span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{statusText}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Phone size={18} />
        </button>
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Video size={18} />
        </button>
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Info size={18} />
        </button>
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;