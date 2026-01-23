export interface ProjectSection {
  title: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  tools: string[];
  summary: string;
  sections: ProjectSection[];
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
  gallery: string[];
}

export const projects: Project[] = [
  {
    slug: "3dof-planar-robotic-arm",
    title: "3-DOF Planar Robotic Arm — Design, Kinematics & Prototype",
    date: "2024-06",
    tags: ["Robotics", "Kinematics", "CAD", "Prototyping"],
    tools: ["SolidWorks", "MATLAB", "Arduino", "3D Printing"],
    summary:
      "Designed and built a 3-DOF planar robotic arm with forward/inverse kinematics, trajectory planning, and a functional prototype.",
    sections: [
      {
        title: "Problem",
        content:
          "Needed to develop a low-cost robotic arm for educational purposes that demonstrates fundamental kinematics concepts while being manufacturable with accessible tools.",
      },
      {
        title: "Approach",
        content:
          "Derived forward and inverse kinematics equations using DH parameters. Designed the mechanical structure in SolidWorks with DFM considerations. Implemented trajectory planning in MATLAB and controlled the prototype using Arduino with servo motors.",
      },
      {
        title: "Results",
        content:
          "Successfully built a working prototype capable of reaching target positions within ±2mm accuracy. The arm can execute smooth trajectories and pick-and-place operations.",
      },
      {
        title: "What I Learned",
        content:
          "Gained deep understanding of robot kinematics, workspace analysis, and the challenges of translating theoretical models to physical systems. Improved skills in CAD design for manufacturing and embedded systems programming.",
      },
    ],
    links: {
      github: "https://github.com/placeholder/robotic-arm",
      demo: "",
      paper: "",
    },
    gallery: ["/images/projects/robotic-arm-1.jpg", "/images/projects/robotic-arm-2.jpg"],
  },
  {
    slug: "cold-gas-rocket-engine",
    title: "Cold Gas Rocket Engine — Nozzle Design & Blowdown Simulation",
    date: "2024-03",
    tags: ["Propulsion", "CFD", "Thermodynamics", "Simulation"],
    tools: ["ANSYS Fluent", "MATLAB", "SolidWorks", "Python"],
    summary:
      "Designed a cold gas thruster with optimized converging-diverging nozzle and simulated blowdown tank dynamics for attitude control applications.",
    sections: [
      {
        title: "Problem",
        content:
          "Design a cold gas propulsion system for a small satellite attitude control system, optimizing for specific impulse while maintaining simplicity and reliability.",
      },
      {
        title: "Approach",
        content:
          "Applied isentropic flow relations to design the nozzle geometry. Used ANSYS Fluent for CFD analysis of the flow field. Developed a MATLAB model for blowdown tank thermodynamics to predict thrust decay over time.",
      },
      {
        title: "Results",
        content:
          "Achieved a nozzle design with 98% theoretical efficiency. CFD results matched analytical predictions within 3%. Blowdown simulation accurately predicted 45-second operational window with nitrogen at 300 psi initial pressure.",
      },
      {
        title: "What I Learned",
        content:
          "Deepened understanding of compressible flow, nozzle design trade-offs, and transient thermodynamic processes. Gained proficiency in CFD meshing strategies for high-speed flows.",
      },
    ],
    links: {
      github: "https://github.com/placeholder/cold-gas-thruster",
      demo: "",
      paper: "",
    },
    gallery: ["/images/projects/cold-gas-1.jpg", "/images/projects/cold-gas-2.jpg"],
  },
  {
    slug: "ramjet-engine-inlet-optimization",
    title: "Ramjet Engine — Two-Ramp Inlet & Nozzle Optimization",
    date: "2024-01",
    tags: ["Propulsion", "CFD", "Aerodynamics", "Optimization"],
    tools: ["ANSYS Fluent", "MATLAB", "Python", "SolidWorks"],
    summary:
      "Optimized a two-ramp supersonic inlet and nozzle for a ramjet engine operating at Mach 2.5, maximizing pressure recovery and thrust.",
    sections: [
      {
        title: "Problem",
        content:
          "Design an efficient supersonic inlet for a ramjet engine that minimizes total pressure loss while ensuring stable operation across a range of flight conditions.",
      },
      {
        title: "Approach",
        content:
          "Used oblique shock theory to determine optimal ramp angles for Mach 2.5 cruise. Performed parametric CFD studies varying ramp angles and cowl position. Optimized nozzle expansion ratio for maximum thrust.",
      },
      {
        title: "Results",
        content:
          "Achieved 92% total pressure recovery with the optimized two-ramp configuration. Nozzle design produced 15% higher thrust compared to baseline. Documented stable operation from Mach 2.0 to 3.0.",
      },
      {
        title: "What I Learned",
        content:
          "Mastered supersonic inlet design principles and shock-boundary layer interactions. Developed skills in design optimization and parametric CFD studies.",
      },
    ],
    links: {
      github: "https://github.com/placeholder/ramjet-inlet",
      demo: "",
      paper: "",
    },
    gallery: ["/images/projects/ramjet-1.jpg", "/images/projects/ramjet-2.jpg"],
  },
  {
    slug: "active-suspension-lqr",
    title: "Active Suspension (Quarter-Car) — State Feedback & LQR",
    date: "2023-11",
    tags: ["Controls", "Simulation", "Dynamics", "MATLAB"],
    tools: ["MATLAB", "Simulink", "Control System Toolbox"],
    summary:
      "Modeled a quarter-car active suspension system and designed LQR and state feedback controllers to minimize body acceleration and suspension travel.",
    sections: [
      {
        title: "Problem",
        content:
          "Design an active suspension controller that improves ride comfort (minimizes body acceleration) while maintaining acceptable suspension travel and tire contact.",
      },
      {
        title: "Approach",
        content:
          "Developed a 2-DOF quarter-car model with sprung and unsprung masses. Designed state feedback and LQR controllers with different weighting matrices. Simulated response to road disturbances including bumps and random road profiles.",
      },
      {
        title: "Results",
        content:
          "LQR controller reduced RMS body acceleration by 45% compared to passive suspension. Achieved 30% reduction in suspension travel variance. Controller remained stable across ±20% parameter variations.",
      },
      {
        title: "What I Learned",
        content:
          "Gained practical experience in state-space modeling, controller design, and the trade-offs between competing performance objectives. Improved MATLAB/Simulink skills for control system simulation.",
      },
    ],
    links: {
      github: "https://github.com/placeholder/active-suspension",
      demo: "",
      paper: "",
    },
    gallery: ["/images/projects/suspension-1.jpg", "/images/projects/suspension-2.jpg"],
  },
];

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const filterProjectsByTags = (tags: string[]): Project[] => {
  if (tags.length === 0) return projects;
  return projects.filter((project) =>
    tags.some((tag) => project.tags.includes(tag))
  );
};
