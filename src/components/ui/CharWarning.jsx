import { useLanguage } from "../../i18n/LanguageContext";
import * as Icon from "./Icons";

// Geçersiz karakter uyarısı.
// Varsayılan olarak `mt-1` kullanır (form input'un altında).
// UserSearch gibi özel pozisyon gereken yerlerde `className` ile override edilebilir.

const ICON_MAP = {
  warning: Icon.Warning,
  error: Icon.Close,
  info: Icon.Info,
};

export default function CharWarning({
  char,
  message,
  type = "warning",
  className = "mt-1",
}) {
  const { t } = useLanguage();

  if (!char && !message) return null;

  const styles = {
    warning: "text-amber-400",
    error: "text-red-400",
    info: "text-accent",
  };

  const IconComponent = ICON_MAP[type] || ICON_MAP.warning;

  const text = message || t("errors.invalid_char", { char });

  return (
    <p
      role="alert"
      className={`text-mono-sm ${styles[type]} ${className} font-mono flex items-center gap-1.5`}
    >
      <IconComponent className="w-3 h-3 shrink-0" />
      {text}
    </p>
  );
}
