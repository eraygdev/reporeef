import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Bir container içinde Tab/Shift+Tab döngüsünü kilitler.
// Açıldığında ilk focusable element'e odaklanır,
// kapandığında önceki focus'a geri döner.
//
// Kullanım:
//   const ref = useRef(null);
//   useFocusTrap(ref, isOpen);
//   <div ref={ref}>...</div>
export function useFocusTrap(ref, isActive) {
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    previouslyFocusedRef.current = document.activeElement;

    const node = ref.current;
    const focusables = node.querySelectorAll(FOCUSABLE_SELECTOR);

    if (focusables.length > 0) {
      setTimeout(() => {
        try {
          focusables[0].focus({ preventScroll: true });
        } catch {
          // sessizce geç
        }
      }, 0);
    } else {
      node.setAttribute("tabindex", "-1");
      try {
        node.focus({ preventScroll: true });
      } catch {
        // sessizce geç
      }
    }

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const list = node.querySelectorAll(FOCUSABLE_SELECTOR);
      if (list.length === 0) {
        e.preventDefault();
        return;
      }

      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !node.contains(active)) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        if (active === last || !node.contains(active)) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus({ preventScroll: true });
        } catch {
          // sessizce geç
        }
      }
    };
  }, [ref, isActive]);
}
