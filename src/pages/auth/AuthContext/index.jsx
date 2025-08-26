import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from '../../../component/ToastAlert';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authModal, setAuthModal] = useState({ show: false, defaultTab: 'login' });
  const [showSessionPage, setShowSessionPage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('userdata');
    const storedtoken = localStorage.getItem('token');
    if (stored) {
      setUser(JSON.parse(stored));
      setToken(storedtoken);
    }
  }, []);

  const login = (payload, remember = true) => {
    const userData = payload;
    setUser(userData.user);
    setToken(userData.token);
    sessionStorage.setItem('userdata', JSON.stringify(userData.user));
    sessionStorage.setItem('token', payload.token);
    if (remember) {
      localStorage.setItem('userdata', JSON.stringify(userData.user));
      localStorage.setItem('token', payload.token);
    }
    setShowSessionPage(false);
    closeAuthModal();
  };

  const logout = () => {
    if (user) {
      const prevSessions = JSON.parse(sessionStorage.getItem("sessionUsers") || "[]");
      const newSession = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email?.trim().toLowerCase() || null,
        phone: user.phone?.trim() || null,
        profilePicture: user.meta_data.profile_picture || ""
      };
      // Check duplicate based ONLY on phone number (ignore email)
      const isDuplicate = prevSessions.some((s) =>
        s.phone && newSession.phone && s.phone === newSession.phone
      );
      if (!isDuplicate) {
        const updatedSessions = [...prevSessions, newSession];
        sessionStorage.setItem("sessionUsers", JSON.stringify(updatedSessions));
      }
    }
    setUser(null);
    sessionStorage.removeItem("userdata");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    setShowSessionPage(true);
    navigate('/');
  };

  const restoreSession = async (password) => {
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (!sessionUser || !password) return false;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          login: sessionUser.email || sessionUser.phone,
          password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { status, message, data } = res.data;
      const { token, user } = data;


      if (status) {
        if (token) {
          login({ token, user }, true);
          return true;
        } else {
          showToast.error(message || 'Your account has been de-activated, please contact the admin');
          return false;
        }
      } else {
        showToast.error(message || 'Invalid credentials');
        return false;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Session login failed';
      showToast.error(msg);
      return false;
    }
  };

  const showAuthModal = (tab = 'login') => {
    setAuthModal({ show: true, defaultTab: tab });
  };

  const closeAuthModal = () => setAuthModal((prev) => ({ ...prev, show: false }));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        authModal,
        showSessionPage,
        setShowSessionPage,
        login,
        logout,
        restoreSession,
        showAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};
