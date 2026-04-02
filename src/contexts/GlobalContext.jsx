import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(en);

  // 🎯 STEP 1: INSTANT localStorage sync + DOM update
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    const storedLanguage = localStorage.getItem('language') || 'en';
    
    // 🎯 IMMEDIATE DOM UPDATE - NO DELAY
    document.documentElement.className = storedTheme;
    document.body.className = storedTheme;
    
    setTheme(storedTheme);
    setLanguage(storedLanguage);
    setTranslations(storedLanguage === 'es' ? es : en);
  }, []); // Runs ONCE on mount

  // 🎯 STEP 2: Theme change handler - INSTANT DOM sync
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    
    // 🎯 INSTANT DOM UPDATE
    document.documentElement.className = newTheme;
    document.body.className = newTheme;
    
    setTheme(newTheme);
  }, [theme]);

  // 🎯 STEP 3: Language change handler
  const changeLanguage = useCallback((lng) => {
    localStorage.setItem('language', lng);
    setLanguage(lng);
    setTranslations(lng === 'es' ? es : en);
  }, []);

  // ✅ Translation with interpolation (UNCHANGED)
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

  // 🎯 NO LOADING SCREEN NEEDED - INSTANT RENDER
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