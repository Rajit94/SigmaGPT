import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import AuthModal from './AuthModal.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
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
  
  // Theme state
  const [isLightTheme, setIsLightTheme] = useState(false);
  
  const toggleTheme = useCallback(() => {
    const newTheme = !isLightTheme;
    setIsLightTheme(newTheme);
    localStorage.setItem('sigmaGPT-theme', newTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sigmaGPT-theme');
    if (savedTheme === 'light') {
      setIsLightTheme(true);
    } else {
      setIsLightTheme(false);
      localStorage.setItem('sigmaGPT-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
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
    allThreads, setAllThreads
  };

  if (loading) {
    return (
      <div className={`app ${isLightTheme ? 'light' : ''}`}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user && authModalOpen) {
    return (
      <div className={`app ${isLightTheme ? 'light' : ''}`}>
        <AuthModal />
      </div>
    );
  }

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
