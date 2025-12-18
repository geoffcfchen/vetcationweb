// src/hooks/useClickOutside.js
import { useEffect } from "react";

/**
 * Calls `onOutside` when the user clicks/taps outside of `containerRef`.
 *
 * - Uses capture phase so it still works even if inner components call stopPropagation.
 * - Listens to both mouse and touch (mobile).
 * - When `enabled` is false, no listeners are attached.
 */
export function useClickOutside(containerRef, onOutside, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e) => {
      const el = containerRef?.current;
      if (!el) return;

      if (el.contains(e.target)) return;
      onOutside?.(e);
    };

    document.addEventListener("mousedown", handler, true);
    document.addEventListener("touchstart", handler, true);

    return () => {
      document.removeEventListener("mousedown", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, [containerRef, onOutside, enabled]);
}
