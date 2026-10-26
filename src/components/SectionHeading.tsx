/** Numbered section header: "02 — Selected research" style, lab-page feel. */
export default function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  intro,
  center = false,
}: {
  id: string;
  index?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <header className={`space-y-3 ${center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}>
      <p className={`flex items-center gap-3 text-eyebrow text-accent ${center ? "justify-center" : ""}`}>
        {index && <span className="text-subtle">{index}</span>}
        {index && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
        <span>{eyebrow}</span>
      </p>
      <h2 id={`${id}-title`} className="text-h2 text-ink">
        {title}
      </h2>
      {intro && <p className="text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
    </header>
  );
}
