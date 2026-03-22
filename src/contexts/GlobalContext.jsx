/**
 * GlobalContext.jsx: Theme management (dark default), Language (EN/ES), localStorage.
 */
import React, { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {  // ← FIXED: Added children
  const [theme, setTheme] = useState('dark');  // ← CHANGED: Dark default
  const [language, setLanguage] = useState('en');

  // Load from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedLanguage = localStorage.getItem('language');
    if (storedTheme) setTheme(storedTheme);
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;  // ← APPLY THEME TO BODY
  }, [theme]);

  // Save language
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  return (
    <GlobalContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        changeLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};