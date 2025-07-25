import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, showAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      showAuthModal('login');
    }
  }, [isAuthenticated, showAuthModal]);

  if (!isAuthenticated) {
    return null; // Don't render protected content
  }

  return children;
};

export default ProtectedRoute;