import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import * as Icon from "../ui/Icons";

const STORAGE_KEY = "reporeef:cookie-consent";

// Alt-sol floating kart. ScrollToTopButton sağ-altta olduğu için çakışmaz.
// localStorage'da 'accepted' varsa hiç gösterme.
export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // FOUC önleme — 800ms sonra göster
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage erişilemezse sessizce geç
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // sessizce geç
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t("cookie_banner.aria")}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-md z-40 animate-dropdown-left"
    >
      <div className="bg-surface/95 backdrop-blur-md border border-accent/20 rounded-card shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-button bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Icon.Lock className="w-4 h-4 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-body-sm font-bold text-text mb-1 font-mono">
                {t("cookie_banner.title")}
              </h3>
              <p className="text-caption text-text-muted leading-relaxed">
                {t("cookie_banner.desc")}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Link
              to="/cookies"
              className="inline-flex items-center justify-center px-3 py-2 text-caption font-medium text-text-muted bg-transparent border border-accent/20 rounded-button hover:border-accent hover:text-text transition-all font-mono"
            >
              {t("cookie_banner.learn_more")}
            </Link>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-bg text-caption font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_-5px_rgba(239,228,206,0.4)] cursor-pointer font-mono"
            >
              <Icon.Check className="w-3.5 h-3.5" />
              {t("cookie_banner.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
