/**
 * useGlobalContext.jsx: Production-ready context hook
 * Direct access to theme, language, translation functions
 */
import React, { useContext } from 'react';
import { GlobalProvider } from '../contexts/GlobalContext';  // ✅ Only import GlobalProvider

// GlobalContext is now INTERNAL - don't export/use directly
const GlobalContextInternal = React.createContext();

export const GlobalProviderWrapper = GlobalProvider;  // Re-export for main.jsx

export const useGlobalContext = () => {
  const context = useContext(GlobalContextInternal);
  
  if (!context) {
    throw new Error(
      'useGlobalContext must be used within a GlobalProvider'
    );
  }
  
  return context;
};