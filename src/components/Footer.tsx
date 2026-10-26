import Link from "next/link";
import { profile } from "../../data/profile";
import { navSections } from "@/lib/nav";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { href: `mailto:${profile.email}`, label: "Email" },
    { href: profile.github, label: "GitHub", external: true },
    { href: profile.linkedin, label: "LinkedIn", external: true },
  ];
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <p className="font-display text-lg font-semibold text-ink">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.tagline}</p>
          <p className="mt-1 text-sm text-subtle">{profile.affiliation.name}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <p className="text-eyebrow text-subtle">Sections</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {navSections.map((s) => (
              <li key={s.id}>
                <Link href={`/#${s.id}`} className="text-sm text-muted hover:text-accent">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cv/" className="text-sm text-muted hover:text-accent">
                CV
              </Link>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="text-eyebrow text-subtle">Elsewhere</p>
          <ul className="mt-3 space-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-sm text-muted hover:text-accent"
                >
                  {l.label}
                  {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 font-mono text-xs text-subtle sm:px-6 lg:px-8">
          © {year} {profile.name} · Built with Next.js, deployed on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
