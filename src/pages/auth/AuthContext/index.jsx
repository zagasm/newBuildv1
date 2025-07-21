import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    localStorage.setItem("gender", userData.gender); 
    localStorage.setItem("date_of_birth", userData.date_of_birth); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    localStorage.removeItem("gender");
    localStorage.removeItem("date_of_birth");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
