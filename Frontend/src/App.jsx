import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect, useCallback } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  // 🌙 Theme state - DEFAULT DARK
  const [isLightTheme, setIsLightTheme] = useState(false);

  // ✅ FIXED: Toggle theme function (stable with useCallback)
  const toggleTheme = useCallback(() => {
    const newTheme = !isLightTheme;
    setIsLightTheme(newTheme);
    localStorage.setItem('sigmaGPT-theme', newTheme ? 'light' : 'dark');
    console.log('✅ Theme toggled to:', newTheme ? 'LIGHT' : 'DARK');
  }, [isLightTheme]);

  // ✅ FIXED: Initialize theme - DARK BY DEFAULT
  useEffect(() => {
    const savedTheme = localStorage.getItem('sigmaGPT-theme');
    
    // DARK BY DEFAULT unless explicitly saved as light
    if (savedTheme === 'light') {
      setIsLightTheme(true);
      console.log('📱 Loaded saved LIGHT theme');
    } else {
      setIsLightTheme(false);  // Force DARK default
      localStorage.setItem('sigmaGPT-theme', 'dark');  // Save dark default
      console.log('🌙 Set DARK theme (default)');
    }
  }, []);

  // ✅ FIXED: Keyboard shortcut - BULLETPROOF
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if input field focused (don't interfere with typing)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
        console.log('⌨️ Shortcut triggered!');
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

  return (
    <div className={`app ${isLightTheme ? 'light' : ''}`}>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
