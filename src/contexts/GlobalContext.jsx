import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    const storedLanguage = localStorage.getItem('language') || 'en';
    setTheme(storedTheme);
    setLanguage(storedLanguage);
    setTranslations(storedLanguage === 'es' ? es : en);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    setTranslations(language === 'es' ? es : en);
  }, [language]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const changeLanguage = useCallback((lng) => {
    setLanguage(lng);
  }, []);

  // ✅ FIXED: Full interpolation support
  const t = useCallback((key, params = {}) => {
    try {
      let translation = key.split('.').reduce((obj, k) => obj?.[k], translations) || key;
      
      // Replace {{param}} with actual values
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`{{${param}}}`, 'g');
        translation = translation.replace(regex, params[param]);
      });
      
      return translation;
    } catch {
      return key;
    }
  }, [translations]);

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