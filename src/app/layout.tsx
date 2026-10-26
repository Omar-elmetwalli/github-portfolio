import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import OnePageNav from "@/components/OnePageNav";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import RevealObserver from "@/components/RevealObserver";
import ChatLauncher from "@/components/ChatLauncher";
import { getPaletteItems } from "@/lib/palette";
import { profile } from "../../data/profile";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { ogImagePath, ogSize } from "@/lib/og";
import { personJsonLd } from "@/lib/jsonld";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Only the body font is preloaded; headings and mono labels swap in when ready.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", preload: false });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap", preload: false });

const title = `${profile.name}: ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.seoDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: `${SITE_URL}/` }],
  keywords: profile.interests,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "profile",
    siteName: profile.name,
    title,
    description: profile.seoDescription,
    url: absoluteUrl("/"),
    locale: "en_US",
    images: [{ url: absoluteUrl(ogImagePath("home")), ...ogSize, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.seoDescription,
    images: [absoluteUrl(ogImagePath("home"))],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#070b12" },
  ],
};

const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;
const loadAnalytics = process.env.NODE_ENV === "production" && !!goatCounterCode;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Sets the light/dark class before first paint to avoid a theme flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-on-accent focus:font-semibold"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <OnePageNav />
            <main id="main" tabIndex={-1} className="flex-grow outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <CommandPalette items={getPaletteItems()} />
          <RevealObserver />
          <ChatLauncher />
        </ThemeProvider>
        {loadAnalytics && (
          // GoatCounter: cookie-free, privacy-friendly page counts. Production only.
          <script
            data-goatcounter={`https://${goatCounterCode}.goatcounter.com/count`}
            async
            src="https://gc.zgo.at/count.js"
          />
        )}
      </body>
    </html>
  );
}
