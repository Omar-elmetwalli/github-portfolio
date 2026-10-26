import { profile } from "../../data/profile";
import type { Publication } from "../../data/publications";
import { SITE_URL, absoluteUrl } from "./site";

/** schema.org Person, rendered on every page. */
export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: profile.name,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.email}`,
  description: profile.seoDescription,
  jobTitle: "Aerospace Engineering Researcher",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: profile.affiliation.name,
    url: profile.affiliation.url,
  },
  alumniOf: profile.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
  address: { "@type": "PostalAddress", addressLocality: "Giza", addressCountry: "EG" },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: [...profile.interests, "Computational Fluid Dynamics", "Turbulence Modeling", "Particle Image Velocimetry"],
});

/** schema.org ScholarlyArticle for one publication. */
export const scholarlyArticleJsonLd = (pub: Publication) => ({
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: pub.title,
  author: pub.authors.map((name) => ({ "@type": "Person", name })),
  ...(pub.year && { datePublished: pub.year }),
  ...(pub.venue && { isPartOf: { "@type": "Periodical", name: pub.venue } }),
  ...(pub.doi && { sameAs: `https://doi.org/${pub.doi}` }),
  ...(pub.pdf && { url: absoluteUrl(pub.pdf) }),
  creativeWorkStatus: pub.status,
});
