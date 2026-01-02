import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(true); // Show on first load
  const [isSignUp, setIsSignUp] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const token = localStorage.getItem('sigmaGPT-token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('sigmaGPT-token');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      localStorage.setItem('sigmaGPT-token', res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', { email, password, name });
      localStorage.setItem('sigmaGPT-token', res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sigmaGPT-token');
    setUser(null);
    setAuthModalOpen(true);
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
};
