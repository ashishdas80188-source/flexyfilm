import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('flexyfilm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('flexyfilm_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Validate or refresh token on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('flexyfilm_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('flexyfilm_token', res.data.token);
      localStorage.setItem('flexyfilm_user', JSON.stringify(res.data));
      setAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, preferredLanguages) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      preferredLanguages,
    });
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('flexyfilm_token', res.data.token);
      localStorage.setItem('flexyfilm_user', JSON.stringify(res.data));
      setAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flexyfilm_token');
    localStorage.removeItem('flexyfilm_user');
  };

  const loginAsDemo = async (role = 'admin') => {
    const email = role === 'admin' ? 'admin@flexyfilm.com' : 'user@flexyfilm.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    return await login(email, password);
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/auth/profile', updateData);
    if (res.success && res.data) {
      const merged = { ...user, ...res.data };
      setUser(merged);
      localStorage.setItem('flexyfilm_user', JSON.stringify(merged));
      return merged;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await api.put('/auth/password', { currentPassword, newPassword });
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        loginAsDemo,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
