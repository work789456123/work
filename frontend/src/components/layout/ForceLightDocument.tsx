"use client";

import { useEffect } from "react";

/**
 * Dark mode is disabled: strip `dark` from <html> and lock `color-scheme` to light.
 * next-themes (or stale localStorage) can otherwise leave `class="dark"` on the root.
 */
export function ForceLightDocument() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }, []);

  return null;
}
