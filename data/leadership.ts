export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  shortName: string;
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
  gallery?: string[];
}

export const leadershipRoles: LeadershipRole[] = [
  {
    id: 'aiaa-zewail-city',
    title: 'Chair & Founder',
    organization: 'American Institute of Aeronautics and Astronautics (AIAA) — Zewail City Student Branch',
    shortName: 'AIAA Zewail City Student Branch',
    location: 'University of Science and Technology, Zewail City, Giza, Egypt',
    period: '2024 — Present',
    status: 'Active',
    summary:
      'Founded and spearheaded the official AIAA Student Branch at Zewail City of Science and Technology. Leading student aerospace initiatives, organizing technical symposiums, hands-on design competitions, and fostering partnerships between academia and the aerospace industry.',
    responsibilities: [
      'Chartered the official student branch under the global American Institute of Aeronautics and Astronautics (AIAA).',
      'Lead executive board operations, technical committees, project teams, and outreach initiatives.',
      'Coordinate university-wide aerospace engineering workshops covering aerodynamics, CAD modeling, CFD simulations, and rocketry.',
      'Facilitate networking sessions, guest speaker webinars, and mentorship programs connecting undergraduate students with international aerospace researchers and industry leaders.',
    ],
    initiatives: [
      'Aeronautical Design & Prototyping Workshops: Hands-on sessions covering airfoil design, glider fabrication, and flight test data acquisition.',
      'Propulsion & CFD Bootcamp: Training university students in ANSYS Fluent meshing and supersonic nozzle compressible gas dynamics.',
      'International Competitions Mentorship: Preparing multidisciplinary student teams for regional and global aerospace design challenges (UAV / VTOL / Rocketry).',
    ],
    achievements: [
      'Successfully established the first accredited AIAA Student Branch at Zewail City.',
      'Recruited and engaged students across aerospace, mechanical, communications, and computational disciplines.',
      'Partnered with faculty advisors and international research collaborators to support student aerospace projects.',
    ],
    tags: ['Leadership', 'Aerospace Community', 'AIAA', 'Student Branch', 'Event Organization', 'Mentorship'],
    links: {
      website: 'https://www.aiaa.org',
      linkedin: 'https://linkedin.com/in/omar-elmetwally-ba272521b',
    },
    gallery: [],
  },
];

export const getLeadershipRoleById = (id: string): LeadershipRole | undefined => {
  return leadershipRoles.find((role) => role.id === id);
};
