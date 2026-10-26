"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { profile } from "../../data/profile";
import { navSections } from "@/lib/nav";

export default function OnePageNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const isDark = mounted ? theme === "dark" : true;
  const themeLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
  const cvActive = pathname.startsWith("/cv");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-cyan-500/10 shadow-lg shadow-black/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 group rounded-xl" aria-label={`${profile.name}, home`}>
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20"
            >
              <span className="w-full h-full bg-white dark:bg-gray-950 rounded-[10px] flex items-center justify-center font-black text-blue-700 dark:text-cyan-300 text-sm font-display">
                OE
              </span>
            </span>
            <span>
              <span className="block font-bold text-base sm:text-lg text-gray-900 dark:text-white font-display">
                {profile.name}
              </span>
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 leading-none">
                Aerospace & Scientific ML
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 p-1.5 rounded-full bg-gray-100/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/80">
              {navSections.map((sec) => {
                const isActive = isHome && activeSection === sec.id;
                return (
                  <li key={sec.id}>
                    <Link
                      href={`/#${sec.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`block px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-700 text-white shadow-md shadow-blue-500/30"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
                      }`}
                    >
                      {sec.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/cv/"
              aria-current={cvActive ? "page" : undefined}
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors border border-gray-800 dark:border-gray-700 shadow-sm"
            >
              CV
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={themeLabel}
              title={themeLabel}
            >
              {isDark ? (
                <svg aria-hidden="true" className="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="w-5 h-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="lg:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-4"
        >
          <ul className="space-y-1">
            {navSections.map((sec) => (
              <li key={sec.id}>
                <Link
                  href={`/#${sec.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {sec.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/cv/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl text-sm font-semibold bg-gray-900 dark:bg-gray-800 text-white"
              >
                CV
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
