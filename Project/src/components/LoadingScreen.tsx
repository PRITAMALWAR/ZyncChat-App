import { MessageCircle } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <MessageCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        </div>
        
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">ChatWave</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading your conversations...</p>
        <div className="mt-8 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;