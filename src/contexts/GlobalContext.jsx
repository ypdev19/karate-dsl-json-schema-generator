import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(en);
  const [isInitialized, setIsInitialized] = useState(false); // 🔧 NEW: Prevent flash

  // ✅ FIXED: Load from localStorage on EVERY mount/reload
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    const storedLanguage = localStorage.getItem('language') || 'en';
    
    setTheme(storedTheme);
    setLanguage(storedLanguage);
    setTranslations(storedLanguage === 'es' ? es : en);
    setIsInitialized(true); // 🔧 Mark as loaded
  }, []); // Keep empty - runs once on mount

  // ✅ FIXED: Apply theme to body AFTER state is set
  useEffect(() => {
    if (!isInitialized) return; // 🔧 Prevent flash
    
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme, isInitialized]);

  // ✅ FIXED: Language persistence
  useEffect(() => {
    if (!isInitialized) return; // 🔧 Prevent flash
    
    localStorage.setItem('language', language);
    setTranslations(language === 'es' ? es : en);
  }, [language, isInitialized]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const changeLanguage = useCallback((lng) => {
    setLanguage(lng);
  }, []);

  // ✅ Translation with interpolation (unchanged)
  const t = useCallback((key, params = {}) => {
    try {
      let translation = key.split('.').reduce((obj, k) => obj?.[k], translations) || key;
      
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`{{${param}}}`, 'g');
        translation = translation.replace(regex, params[param]);
      });
      
      return translation;
    } catch {
      return key;
    }
  }, [translations]);

  // 🔧 Prevent render until initialized
  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within GlobalProvider');
  }
  return context;
};