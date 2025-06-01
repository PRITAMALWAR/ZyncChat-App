import { MessageCircle } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-6">
        <MessageCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Welcome to ChatWave
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Select a conversation from the sidebar to start chatting, or create a new one to connect with friends and colleagues.
      </p>
      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors">
        Start a new conversation
      </button>
    </div>
  );
};

export default EmptyState;