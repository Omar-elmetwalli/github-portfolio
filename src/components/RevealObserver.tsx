"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades in elements marked with data-reveal as they scroll into view.
 * One shared observer for the whole page; CSS handles reduced motion.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")];
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
