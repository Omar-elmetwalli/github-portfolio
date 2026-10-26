"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { profile } from "../../data/profile";
import { navSections } from "@/lib/nav";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { IconMoon, IconSearch, IconSun } from "./Icons";

export default function OnePageNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const isDark = mounted ? theme === "dark" : true;
  const themeLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
  const openPalette = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label={`${profile.name}, home`}>
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong font-mono text-xs font-semibold text-accent">
            OE
          </span>
          <span className="hidden font-display text-[15px] font-semibold text-ink sm:block">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navSections.map((s) => {
              const active = isHome && activeSection === s.id;
              return (
                <li key={s.id}>
                  <Link
                    href={`/#${s.id}`}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      active ? "bg-accent-soft font-medium text-accent" : "text-muted hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-subtle hover:border-line-strong hover:text-ink"
            aria-label="Search (Ctrl+K)"
          >
            <IconSearch className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1 font-mono text-[10px] md:inline">⌘K</kbd>
          </button>
          <Link
            href="/cv/"
            aria-current={pathname.startsWith("/cv") ? "page" : undefined}
            className="hidden rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-bg hover:opacity-90 sm:inline-block"
          >
            CV
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-ink"
          >
            {isDark ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-ink xl:hidden"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {menuOpen ? <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line bg-bg px-4 pb-5 pt-2 xl:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {navSections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-2"
                >
                  {s.label}
                </Link>
              </li>
            ))}
            <li className="col-span-2 mt-2">
              <Link
                href="/cv/"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md bg-ink py-2.5 text-center text-sm font-semibold text-bg"
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
