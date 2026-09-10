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
  gallery: string[];
}

export const leadershipRoles: LeadershipRole[] = [
  {
    id: 'aiaa-zewail-city',
    title: 'Founder & Chair',
    organization: 'American Institute of Aeronautics and Astronautics (AIAA) — Zewail City Student Branch',
    shortName: 'AIAA Zewail City Student Branch',
    subtitle: "Egypt's First Official AIAA-Affiliated Student Chapter | AIAA Member #1865899",
    location: 'University of Science and Technology, Zewail City, Giza, Egypt',
    period: '2024 — Present',
    status: 'Active',
    summary:
      "Founded from scratch and established the first official AIAA-affiliated Student Branch in Egypt at Zewail City of Science and Technology. Built the chapter from zero to 60+ active members structured into five departments (Technical, Marketing & Media, PR & Outreach, HR & Operations, Fundraising). Forged regional academic partnerships with universities across Saudi Arabia (KSA) and the United Arab Emirates (UAE), as well as ASME AUC. Driven by a dedicated vision to build a thriving aerospace research community in Egypt and place the nation firmly on the global aerospace map.",
    responsibilities: [
      "Chartered Egypt's first AIAA-affiliated student chapter, securing official recognition from AIAA Global Headquarters.",
      "Built the branch from zero to 60+ members with a full departmental structure: Technical, Marketing & Media, PR & Outreach, HR & Operations, and Fundraising.",
      "Organized 'D’Alembert’s Paradox: A Tale of Two Schools,' a premier branch symposium featuring Prof. Haitham Taha (UC Irvine), sponsored by Labtronic.",
      "Organized technical webinars (AeroTalk series) connecting students with global aerospace researchers and industry experts.",
      "Established bilateral collaborations with universities in KSA and UAE to promote regional aerospace competitions and joint student projects.",
      "Formed cross-institutional joint initiatives with ASME AUC (American Society of Mechanical Engineers at the American University in Cairo).",
      "Lead multidisciplinary student project teams across CFD/Aerodynamics, CubeSat systems, and Design/Build/Fly aircraft.",
    ],
    initiatives: [
      "Distinguished Speaker Symposia: Hosted world-renowned flight dynamics and aerodynamics professor Dr. Haitham Taha (UC Irvine) for an on-campus seminar on unsteady aerodynamics.",
      "Regional Aerospace Network: Initiated cross-border student collaborations with universities in Saudi Arabia and the UAE to share research and competition expertise.",
      "ASME AUC Joint Workshops: Partnered with ASME AUC on engineering workshops, technical panels, and intercollegiate aerospace hackathons.",
      "AeroTalk Technical Webinars: Conducted webinars on supersonic compressible flows, rocket propulsion systems, and orbital trajectory design.",
      "Hands-On Flight Prototyping: Mentored student project tracks in aerodynamic airfoil testing, balsa glider trimming, and telemetry integration.",
    ],
    achievements: [
      "Established the first accredited AIAA Student Branch in Egypt's history.",
      "Recruited, onboarded, and led 60+ students spanning aerospace, mechanical, communications, and computer engineering.",
      "Successfully hosted international guest lectures sponsored by industry leaders including Labtronic.",
      "Launched active student teams competing in national and regional aerospace engineering competitions.",
    ],
    tags: ['Leadership', 'Founder & Chair', 'AIAA', 'Aerospace Community', 'Symposia', 'Global Network', 'Mentorship'],
    links: {
      website: 'https://aiaa-zewail.vercel.app/',
      linkedin: 'https://www.linkedin.com/company/aiaa-student-branch-zewail-city/',
    },
    gallery: [
      '/images/leadership/aiaa/logo.png',
      '/images/leadership/aiaa/dr_haitham_visit_1.jpg',
      '/images/leadership/aiaa/dr_haitham_visit_2.jpg',
      '/images/leadership/aiaa/dr_haitham_visit_3.jpg',
      '/images/leadership/aiaa/first_webinar.png',
      '/images/leadership/aiaa/third_webinar.png',
      '/images/leadership/aiaa/aiaa_highlights.mp4',
      '/images/leadership/aiaa/aiaa_event.mp4',
    ],
  },
];

export const getLeadershipRoleById = (id: string): LeadershipRole | undefined => {
  return leadershipRoles.find((role) => role.id === id);
};
