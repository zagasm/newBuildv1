import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState({
    show: false,
    defaultTab: 'login'
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("userdata");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userdata", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };
  const showAuthModal = (tab = 'login') => {
    setAuthModal({
      show: true,
      defaultTab: tab
    });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, show: false }));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ 
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        authModal,
        showAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};