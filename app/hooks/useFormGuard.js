import { useCallback, useMemo, useRef } from "react";

// Form submit guard'ı — gereksiz/tekrarlı istekleri engeller.
//
// İki iş yapar:
//   1. isDirty  → mevcut değerler ilk halinden farklı mı?
//   2. guard()  → son çağrıdan delayMs sonra mı geçti? (throttle)
//
// Kullanım:
//   const initial = { username: "", bio: "" };
//   const { isDirty, guard } = useFormGuard({ username, bio }, initial);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isDirty) return;   // değişiklik yok → hiç gitme
//     if (!guard()) return;   // çok hızlı tıklama → throttle
//     // ... api çağrısı
//   };
//
//   <button disabled={submitting || !isDirty}>Kaydet</button>
//
// initial null/undefined ise → isDirty her zaman false (henüz yüklenmedi).
export function useFormGuard(current, initial, delayMs = 1000) {
  const lastSubmitRef = useRef(0);

  const isDirty = useMemo(() => {
    if (!initial) return false;
    return !shallowEqual(current, initial);
  }, [current, initial]);

  const guard = useCallback(() => {
    const now = Date.now();
    if (now - lastSubmitRef.current < delayMs) return false;
    lastSubmitRef.current = now;
    return true;
  }, [delayMs]);

  return { isDirty, guard };
}

// Basit shallow equality — düz objeler için yeterli.
function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
}
