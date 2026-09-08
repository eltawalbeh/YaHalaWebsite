import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "ar" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (ar: string, en: string) => string;
  dir: "rtl" | "ltr";
  isAr: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: (ar, _en) => ar,
  dir: "rtl",
  isAr: true,
});

function safeGetStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (safeGetStorage("yh_lang") as Lang) || "ar";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    safeSetStorage("yh_lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (ar: string, en: string) => lang === "ar" ? ar : en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isAr = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, isAr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}