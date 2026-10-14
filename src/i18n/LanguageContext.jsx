import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  loadTranslation,
  getNestedValue,
  interpolate,
} from "./translations/index";

const LanguageContext = createContext(null);

const STORAGE_KEY = "reporeef:lang";
const SUPPORTED = ["en", "tr"];
const DEFAULT_LANG = "en";

// ═══════════════════════════════════════════════════════════
// KRİTİK FALLBACK — Dil chunk'ı yüklenene kadar (100-300ms)
// gösterilen minimal İngilizce metinler. Sadece ilk render'da
// görünen kritik yerler (navbar, loading, footer butonları).
// ═══════════════════════════════════════════════════════════
const CRITICAL_EN = {
  navbar: {
    auth: { login: "Sign In", register: "Sign Up" },
    aria: {
      open_menu: "Open menu",
      search_users: "Search users",
      logo: "RepoReef home",
    },
  },
  auth: { loading: "Loading..." },
  callback: { loading: "signing in" },
  scroll_to_top: { aria: "Back to top" },
  footer: {
    cta: { github_start: "Start with GitHub" },
  },
};

// Cihaz dilinden başlangıç dilini seç
function detectInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    const browserLang = navigator.language?.toLowerCase() || "";
    if (browserLang.startsWith("tr")) return "tr";

    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);
  const [translations, setTranslations] = useState(null);
  const [ready, setReady] = useState(false);

  // lang değişince localStorage + html lang attribute
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // sessizce geç
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // Aktif dilin translations'ını lazy yükle
  useEffect(() => {
    let cancelled = false;
    setReady(false);

    loadTranslation(lang)
      .then((t) => {
        if (cancelled) return;
        setTranslations(t);
        setReady(true);
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.warn("[i18n] translation load failed:", err);
        }
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang)) {
      setLangState(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "en" ? "tr" : "en"));
  }, []);

  const t = useCallback(
    (key, params) => {
      // Henüz yüklenmedi → kritik fallback (navbar, loading vs.)
      if (!translations) {
        const fallback = getNestedValue(CRITICAL_EN, key);
        return fallback !== undefined ? interpolate(fallback, params) : key;
      }

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
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, ready }}>
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
