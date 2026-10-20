// Büyük sayıları kısaltır.
// 1234 → "1.2K", 30000 → "30K", 1500000 → "1.5M", 3000000 → "3M"
// 1000 altındaki sayılar aynen döner: 42 → "42"
export function formatCount(num) {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  if (Number.isNaN(n)) return "0";

  if (n < 1000) return String(n);

  if (n < 1_000_000) {
    const k = n / 1000;
    // 30.0 → "30K", 1.5 → "1.5K", 1.23 → "1.2K"
    return (k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.floor(k)) + "K";
  }

  if (n < 1_000_000_000) {
    const m = n / 1_000_000;
    return (m < 10 ? m.toFixed(1).replace(/\.0$/, "") : Math.floor(m)) + "M";
  }

  const b = n / 1_000_000_000;
  return (b < 10 ? b.toFixed(1).replace(/\.0$/, "") : Math.floor(b)) + "B";
}

// last_seen_at → durum: 'online' | 'today' | 'yesterday' | 'older' | 'none'
// Online eşiği 10 dk — backend throttle 5 dk olduğu için tutarlı.
export function getLastSeenStatus(isoString) {
  if (!isoString) return "none";

  const last = new Date(isoString).getTime();
  const now = Date.now();
  const diffMin = (now - last) / 60000;

  if (diffMin < 10) return "online";

  const nowDate = new Date(now);
  const lastDate = new Date(last);

  const sameDay =
    nowDate.getFullYear() === lastDate.getFullYear() &&
    nowDate.getMonth() === lastDate.getMonth() &&
    nowDate.getDate() === lastDate.getDate();

  if (sameDay) return "today";

  const yesterday = new Date(now - 86400000);
  if (
    yesterday.getFullYear() === lastDate.getFullYear() &&
    yesterday.getMonth() === lastDate.getMonth() &&
    yesterday.getDate() === lastDate.getDate()
  ) {
    return "yesterday";
  }

  return "older";
}

// Gün seviyesinde insan-okunur metin.
export function formatLastSeen(isoString, t) {
  const status = getLastSeenStatus(isoString);

  if (status === "none") return t("contributors.last_seen.never");
  if (status === "online") return t("contributors.last_seen.online");
  if (status === "today") return t("contributors.last_seen.today");
  if (status === "yesterday") return t("contributors.last_seen.yesterday");

  const days = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 86400000,
  );
  return t("contributors.last_seen.days_ago", { days });
}
