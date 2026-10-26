export default function SectionHeading({
  id,
  eyebrow,
  title,
  center = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={`space-y-2 ${center ? "text-center max-w-xl mx-auto" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">{eyebrow}</p>
      <h2 id={`${id}-title`} className="text-3xl sm:text-4xl font-bold text-gray-950 dark:text-white">
        {title}
      </h2>
    </div>
  );
}
