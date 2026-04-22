
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    
    sessionStorage.removeItem('sigmaGPT-token');
    const token = sessionStorage.getItem('sigmaGPT-token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
      setAuthModalOpen(true);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setAuthModalOpen(false);
    } catch (err) {
      console.error('Token verification failed:', err);
      sessionStorage.removeItem('sigmaGPT-token');
      setAuthModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        email, 
        password 
      });
      sessionStorage.setItem('sigmaGPT-token', res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        email, 
        password, 
        name 
      });
      sessionStorage.setItem('sigmaGPT-token', res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('sigmaGPT-token');
    setUser(null);
    setAuthModalOpen(true);
    setIsSignUp(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    authModalOpen,
    setAuthModalOpen,
    isSignUp,
    setIsSignUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
