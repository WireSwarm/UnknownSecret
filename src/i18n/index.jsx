import React, { createContext, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext({ language: 'fr', t: (k) => k });

export function LanguageProvider({ language, children }) {
  const t = (key, arg) => {
    const val = translations[language]?.[key] ?? translations['en']?.[key] ?? key;
    if (typeof val === 'function') return val(arg);
    return val;
  };
  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
