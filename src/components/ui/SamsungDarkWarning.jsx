// src/components/ui/SamsungDarkWarning.jsx
import { useState, useEffect } from "react";
import * as Icon from "../../components/ui/Icons";

const STORAGE_KEY = "reporeef:samsung-dark-warning-dismissed";

export default function SamsungDarkWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
      if (isSamsung) {
        setVisible(true);
      }
    } catch {
      // sessizce geç
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // sessizce geç
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40">
      <div className="bg-surface/95 backdrop-blur-md border border-amber-400/30 rounded-card shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <Icon.Warning className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-body-sm font-bold text-text mb-1 font-mono">
              Samsung Internet uyarısı
            </h3>
            <p className="text-caption text-text-muted leading-relaxed mb-3">
              Tarayıcınızın "force dark mode" özelliği RepoReef'in renklerini
              bozabilir. Düzgün görünüm için:
            </p>
            <ol className="text-caption text-text-muted leading-relaxed mb-3 list-decimal list-inside space-y-1">
              <li>
                Ayarlar → Web sayfası görünümü → Karanlık mod → "Web sitelerinde
                karanlık modu zorla" seçeneğini kapatın
              </li>
              <li>Veya farklı bir tarayıcı kullanın (Chrome, Firefox)</li>
            </ol>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-caption text-text-muted hover:text-text underline underline-offset-2 transition-colors cursor-pointer font-mono"
            >
              Anladım, bir daha gösterme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
