import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hanginout_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hanginout_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('hanginout_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Failed to load user profile with current token:", err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('hanginout_token', jwtToken);
    localStorage.setItem('hanginout_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('hanginout_token', jwtToken);
    localStorage.setItem('hanginout_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    const res = await authService.updateProfile(updateData);
    if (res.data) {
      setUser(res.data);
      localStorage.setItem('hanginout_user', JSON.stringify(res.data));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
