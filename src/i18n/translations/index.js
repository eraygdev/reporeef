// ═══════════════════════════════════════════════════════════
// TRANSLATIONS — Lazy yükleyici
// ═══════════════════════════════════════════════════════════
//
// Her dil ayrı bir chunk. Aktif dil yüklenir, diğeri indirilmez.
// Kullanıcı TR ise sadece tr.js iner (~25 KB). EN ise en.js.
//
// Kullanım:
//   const t = await loadTranslation('tr');
// ═══════════════════════════════════════════════════════════

const loaders = {
  en: () => import("./en.js").then((m) => m.en),
  tr: () => import("./tr.js").then((m) => m.tr),
};

export function loadTranslation(lang) {
  const loader = loaders[lang] || loaders.en;
  return loader();
}

// ═══════════════════════════════════════════════════════════
// YARDIMCI FONKSİYON: objeden key ile değer okuma
// ═══════════════════════════════════════════════════════════
export function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// ═══════════════════════════════════════════════════════════
// YARDIMCI FONKSİYON: placeholder değiştirme
// ═══════════════════════════════════════════════════════════
export function interpolate(str, params) {
  if (!params || typeof str !== "string") return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{{${key}}}`;
  });
}
