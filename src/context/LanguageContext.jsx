import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); // EN, HI, KN

  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev === 'EN') return 'HI';
      if (prev === 'HI') return 'KN';
      return 'EN';
    });
  };

  const value = { language, toggleLanguage };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
