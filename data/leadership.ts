// Content lives in data/content/leadership.json; edit it there or with `pnpm admin`.
import data from "./content/leadership.json" with { type: "json" };

export interface GalleryItem {
  src: string;
  /** Short caption shown under the thumbnail. */
  caption: string;
  /** Describes the image for screen readers. Defaults to the caption. */
  alt?: string;
  /** Still image shown before a video plays. */
  poster?: string;
}

export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  shortName: string;
  subtitle?: string;
  location: string;
  period: string;
  status: 'Active' | 'Completed';
  summary: string;
  responsibilities: string[];
  initiatives: string[];
  achievements: string[];
  tags: string[];
  links?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  gallery: GalleryItem[];
}

export const leadershipRoles = data as LeadershipRole[];

export const getLeadershipRoleById = (id: string): LeadershipRole | undefined => {
  return leadershipRoles.find((role) => role.id === id);
};
