import { ReactNode, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, Moon, Menu, X, MessageCircle, 
  Settings, LogOut, User, Users, BellRing 
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:inline-block">ChatWave</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Notifications"
            >
              <BellRing size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button className="flex items-center">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">ChatWave</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2">
                  Navigation
                </div>
                <button className="flex items-center space-x-2 p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <MessageCircle size={18} />
                  <span>Messages</span>
                </button>
                <button className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Users size={18} />
                  <span>Groups</span>
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2">
                  Account
                </div>
                <button className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User size={18} />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={logout} 
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default MainLayout;