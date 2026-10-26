import { publications } from "../../data/publications";
import { awards } from "../../data/awards";

/** Home-page sections, in page order. The nav and footer both use this list. */
export const navSections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  ...(publications.length ? [{ id: "publications", label: "Publications" }] : []),
  ...(awards.length ? [{ id: "awards", label: "Awards" }] : []),
  { id: "leadership", label: "Leadership" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
