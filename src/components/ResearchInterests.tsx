import Link from "next/link";
import { profile } from "../../data/profile";
import { getPublicProjects } from "../../data/projects";
import { IconFlow, IconLayers, IconVortex } from "./Icons";
import RichText from "./RichText";

const icons = { closure: IconVortex, surrogates: IconLayers, control: IconFlow } as const;

export default function ResearchInterests() {
  const titles = new Map(getPublicProjects().map((p) => [p.slug, p.title]));
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg lg:col-span-8" data-reveal>
          {profile.bio.map((p) => (
            <p key={p}>
              <RichText text={p} />
            </p>
          ))}
        </div>
        <aside className="lg:col-span-4" data-reveal aria-label="Research collaborations">
          <p className="text-eyebrow text-subtle">Collaborations</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {profile.collaborations.map((c) => (
              <li key={c.name} className="py-3">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <p className="text-sm text-subtle">{c.focus}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {profile.researchInterests.map((r, i) => {
          const Icon = icons[r.key as keyof typeof icons] ?? IconFlow;
          return (
            <li key={r.key} className="card card-hover flex flex-col p-6" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-h3 text-ink">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Methods">
                {r.methods.map((m) => (
                  <li key={m} className="rounded-sm border border-line px-2 py-0.5 font-mono text-[11px] text-subtle">
                    {m}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <p className="text-eyebrow text-subtle">Related work</p>
                <ul className="mt-2 space-y-1.5">
                  {r.projects
                    .filter((slug) => titles.has(slug))
                    .map((slug) => (
                      <li key={slug}>
                        <Link href={`/projects/${slug}/`} className="group inline-flex gap-1.5 text-sm font-medium text-accent hover:underline">
                          <span aria-hidden="true">→</span>
                          <span className="line-clamp-1">{titles.get(slug)}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
