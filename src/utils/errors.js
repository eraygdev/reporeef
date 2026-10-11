// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// Backend'den gelen error code'ları kullanıcıya gösterilebilir
// mesaja çevirir. i18n `errors:` namespace'ini kullanır.
// ═══════════════════════════════════════════════════════════

// getErrorMessage backend error code'unu i18n'den çevirir.
// Bulunamazsa generic mesaj döner.
export function getErrorMessage(errorCode, t) {
  if (!errorCode || typeof errorCode !== "string") {
    return t("errors.generic");
  }

  const key = `errors.${errorCode}`;
  const msg = t(key);

  // t() çeviriyi bulamazsa key'i döner
  return msg === key ? t("errors.generic") : msg;
}

// Backend response'undan hem error code hem mesaj döner.
// Kullanım: const { code, message } = await extractError(res, t);
export async function extractError(res, t) {
  try {
    const data = await res.json();
    const code = data?.error || null;
    const message = getErrorMessage(code, t);
    return { code, message };
  } catch {
    return { code: null, message: t("errors.generic") };
  }
}
