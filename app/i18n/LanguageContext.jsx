import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getTranslation,
  getNestedValue,
  interpolate,
} from "./translations/index";

const LanguageContext = createContext(null);

const STORAGE_KEY = "reporeef:lang";
const SUPPORTED = ["en", "tr"];
const DEFAULT_LANG = "en";

export function LanguageProvider({ children }) {
  // SSG (Statik Site Üretimi) sırasında sunucu ve tarayıcının ilk render'ı
  // birbiriyle eşleşmelidir (Hydration hatasını önlemek için).
  // Bu yüzden başlangıç dili her zaman varsayılan (en) olur.
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // Tarayıcıya yüklendikten hemen sonra (hydration sonrası)
  // kullanıcının gerçek dil tercihini kontrol et ve uygula.
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const browserLang = navigator.language?.toLowerCase() || "";
      const detected =
        stored && SUPPORTED.includes(stored)
          ? stored
          : browserLang.startsWith("tr")
            ? "tr"
            : DEFAULT_LANG;

      if (detected !== lang) {
        setLangState(detected);
      }
    } catch {
      // sessizce geç
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dil değişince localStorage ve html lang attribute'unu güncelle
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // sessizce geç
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang)) {
      setLangState(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "en" ? "tr" : "en"));
  }, []);

  // Çevirileri senkron (anında) alıyoruz. Lazy load yok.
  const translations = getTranslation(lang);

  const t = useCallback(
    (key, params) => {
      const value = getNestedValue(translations, key);
      if (value === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation: "${key}"`);
        }
        return key;
      }
      return interpolate(value, params);
    },
    [translations],
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggleLang, t, ready: true }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
