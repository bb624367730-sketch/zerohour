import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, translations as allTranslations, LANG_LABELS } from './translations';

const STORAGE_KEY = 'fomo3d-lang';

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'zh-CN' || stored === 'ja' || stored === 'ko') return stored;
  } catch {}
  return 'en';
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  langLabels: typeof LANG_LABELS;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = allTranslations[lang] as unknown as Record<string, string>;
      const fallback = allTranslations['en'] as unknown as Record<string, string>;
      let text = dict[key] ?? fallback[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, langLabels: LANG_LABELS }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useT must be used within LanguageProvider');
  return ctx;
}
