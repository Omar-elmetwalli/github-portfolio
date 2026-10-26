// Small stroke icons (24px grid, currentColor). Decorative: always aria-hidden.
type P = { className?: string };
const base = (className = "h-5 w-5") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/** Vortex / turbulence. */
export const IconVortex = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 12a2 2 0 1 0 2 2" />
    <path d="M12 12a5 5 0 1 1-5 5" />
    <path d="M12 12a8 8 0 1 0 8-8" />
  </svg>
);
/** Layered surrogate / reduced model. */
export const IconLayers = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);
/** Streamlines over a surface (flow control). */
export const IconFlow = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 7c4 0 5-2 9-2s5 2 9 2" />
    <path d="M3 12c4 0 5-2 9-2s5 2 9 2" />
    <path d="M3 17h18" />
    <path d="M7 17v3M12 17v3M17 17v3" />
  </svg>
);
export const IconArrowRight = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconDownload = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
export const IconSearch = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
export const IconFile = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const IconCode = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
  </svg>
);
export const IconTrophy = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
    <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4" />
  </svg>
);
export const IconCap = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="m12 4 10 5-10 5L2 9l10-5Z" />
    <path d="M6 11v5c3 2 9 2 12 0v-5" />
  </svg>
);
export const IconMail = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const IconSun = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const IconMoon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
export const IconPlay = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M8 5v14l11-7L8 5Z" />
  </svg>
);
