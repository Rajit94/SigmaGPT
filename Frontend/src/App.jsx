import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import AuthModal from './AuthModal.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { useAuth } from './hooks/useauth.js';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect, useCallback } from 'react';
import { v1 as uuidv1 } from "uuid";

function AppContent() {
  const { user, loading, authModalOpen } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  // Theme state - FIXED: Initialize from localStorage directly
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sigmaGPT-theme');
    return savedTheme === 'light';
  });
  
  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => {
      const newTheme = !prev;
      localStorage.setItem('sigmaGPT-theme', newTheme ? 'light' : 'dark');
      
      // Apply theme to HTML element
      if (newTheme) {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      
      return newTheme;
    });
  }, []);

  // FIXED: Apply theme class on mount and when theme changes
  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightTheme]);

  // Keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Ctrl+Shift+L to toggle theme
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleTheme();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isLightTheme,
    toggleTheme
  };

  // Loading state
  if (loading) {
    return (
      <div className={`app ${isLightTheme ? 'light' : ''}`}>
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: 'var(--text-primary)'
        }}>
          <div className="loading-spinner">
            Loading SigmaGPT...
          </div>
        </div>
      </div>
    );
  }

  // Show auth modal if user is not authenticated
  if (!user && authModalOpen) {
    return (
      <div className={`app ${isLightTheme ? 'light' : ''}`}>
        <AuthModal />
      </div>
    );
  }

  // Main app
  return (
    <div className={`app ${isLightTheme ? 'light' : ''}`}>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
