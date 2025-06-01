import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, MessageCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">ChatWave</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 ChatWave. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;