import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import LoadingScreen from '../components/LoadingScreen';

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    );
  }

  return (
    <MainLayout>
      <ChatPage />
    </MainLayout>
  );
};

export default AppRouter;