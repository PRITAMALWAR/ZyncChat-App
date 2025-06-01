import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import AppRouter from './routes/AppRouter';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <AppRouter />
          <Toaster />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;