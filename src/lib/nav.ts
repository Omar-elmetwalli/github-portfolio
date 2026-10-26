import { publications } from "../../data/publications";
import { awards } from "../../data/awards";

/** Home-page sections, in page order. The nav, footer, and command palette use this list. */
export const navSections = [
  { id: "research", label: "Research" },
  ...(publications.length ? [{ id: "publications", label: "Publications" }] : []),
  { id: "projects", label: "Projects" },
  ...(awards.length ? [{ id: "awards", label: "Awards" }] : []),
  { id: "leadership", label: "Leadership" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
