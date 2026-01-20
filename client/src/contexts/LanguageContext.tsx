import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, createTranslator } from "../locales/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * 브라우저 언어를 감지하여 기본 언어를 설정합니다.
 */
function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith("ko")) {
    return "ko";
  } else if (browserLang.startsWith("zh")) {
    return "zh";
  } else {
    return "en";
  }
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // localStorage에서 저장된 언어를 가져오거나 브라우저 언어 감지
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem("language") as Language;
    return savedLang || detectBrowserLanguage();
  });

  // 번역 함수 생성
  const t = createTranslator(language);

  // 언어 변경 시 localStorage에 저장
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // 초기 마운트 시 브라우저 언어 감지 (localStorage에 저장된 값이 없는 경우)
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (!savedLang) {
      const detectedLang = detectBrowserLanguage();
      setLanguageState(detectedLang);
      localStorage.setItem("language", detectedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 언어 컨텍스트를 사용하는 훅
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
