import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';
import ChatListItem from './ChatListItem';

const ChatSidebar = () => {
  const { chats, setActiveChat, activeChat } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'groups'

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'chats' && chat.type === 'group') return false;
    if (activeTab === 'groups' && chat.type === 'individual') return false;
    
    // Search in chat name or participants names
    const chatName = chat.name || '';
    const participantNames = chat.participants.map(p => p.name).join(' ');
    const lastMessageContent = chat.lastMessage?.content || '';
    
    const searchIn = `${chatName} ${participantNames} ${lastMessageContent}`.toLowerCase();
    return searchQuery === '' || searchIn.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full">
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="New message"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-1
            ${activeTab === 'chats' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <MessageCircle size={16} />
          <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-1
            ${activeTab === 'groups' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Users size={16} />
          <span>Groups</span>
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => setActiveChat(chat)}
                currentUserId={user?.id || ''}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
              {activeTab === 'chats' ? (
                <MessageCircle className="h-6 w-6 text-gray-400" />
              ) : (
                <Users className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              No {activeTab} found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery 
                ? `No ${activeTab} matching "${searchQuery}"`
                : `You don't have any ${activeTab} yet`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;