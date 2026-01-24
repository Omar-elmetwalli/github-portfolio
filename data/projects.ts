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
    date: "2025-12",
    tags: ["Robotics", "Kinematics", "CAD", "Prototyping"],
    tools: ["SolidWorks", "MATLAB", "Arduino", "3D Printing"],
    summary:
      "Designed, modeled, and built a low-cost 3-DOF planar robotic arm. Derived analytical FK/IK, built a MATLAB “digital twin” GUI for interactive control + safety checks, and drove SG90 servos via Arduino; validated performance with LiDAR measurements.",
    sections: [
      {
        title: "Problem",
        content:
          "Build a low-cost 3-DOF manipulator that demonstrates the full pipeline from kinematic modeling to a working prototype, with safe interactive control via a GUI.",
      },
      {
        title: "Approach",
        content:
          "Derived analytical forward/inverse kinematics and verified them in a custom MATLAB digital twin (no robotics toolbox). Implemented safety checks (reachability + floor collision clamp + servo limit validation), then sent commands to an Arduino Uno driving SG90 servos using microsecond-level PWM mapping and trajectory smoothing. Designed a lightweight truss arm in CAD, exported DXF, and laser-cut 3mm plywood for fabrication and assembly.",
      },
      {
        title: "Results",
        content:
          `Achieved a functional prototype with real-time GUI control and stable motion. Load analysis showed a comfortable torque margin at the shoulder joint (Safety Factor ≈ 4.6). Validation using LiDAR measurements compared multiple target poses between the digital twin and the physical arm.

How to translate clean math into hardware that won’t break: managing servo torque budgets with lightweight structures, implementing safety checks in software, and smoothing trajectories for stable motion. Gained hands-on experience with CAD design for laser cutting and Arduino servo control.

Comparison between the MATLAB digital twin and the physical robotic arm. The images below show target pose validation using LiDAR measurements.`
      },
    ],
    links: {
      github: "https://github.com/placeholder/robotic-arm",
      demo: "",
      paper: "/files/Mechatronics_Project_Report.pdf",
    },

    gallery: [
      "/images/projects/robotic-arm/gui.png",
      "/images/projects/robotic-arm/assembled.jpg"
    ],
  },
  {
    slug: "cold-gas-rocket-engine",
    title: "Cold Gas Rocket Engine — Nozzle Design & Blowdown Simulation",
    date: "2026-01",
    tags: ["Propulsion", "CFD", "Thermodynamics", "Simulation"],
    tools: ["MATLAB"], // Only MATLAB remains
    summary:
      "Designed and simulated a blowdown cold-gas rocket engine using 1D compressible-flow relations. Sized a CD nozzle at P0=100 bar, T0=2200 K (perfect expansion), then coupled a time-marching adiabatic tank model to predict pressure/temperature, mass flow, and thrust vs time (with a Rayleigh heat-addition extension).",
    sections: [
      {
        title: "Problem",
        content:
          "Design a blowdown cold-gas rocket engine and predict transient performance using gas-dynamics fundamentals (choking, nozzle expansion, and adiabatic tank discharge).",
      },
      {
        title: "Approach",
        content:
          "Sized a CD nozzle at 100 bar / 2200 K with perfect expansion. Built a time-marching adiabatic rigid-tank model coupled to a choked nozzle to compute Pt(t), Tt(t), ṁ(t), and thrust. Bonus: added a constant-area Rayleigh heat-addition duct to capture stagnation-pressure losses and sized a combustor diameter for a low inlet Mach number.",
      },
      {
        title: "Results",
        content:
          `Used real outputs from the report:

Design point: P0,d = 100 bar, T0,d = 2200 K, perfect expansion to ambient

Tank initial: Pt,0 = 200 bar, Tt,0 = 300 K, Vt = 0.5 m³, working gas: air

Final nozzle sizing (Table 1):

Dt = 20.0 mm
Me = 3.68
Ae/At = 8.05
De = 56.7 mm

Design thrust ≈ 4865 N (≈ 4.87 kN)

Deepened understanding of compressible flow, nozzle design.`
      },
    ],
    links: {
      github: "https://github.com/placeholder/cold-gas-thruster",
      demo: "",
      paper: "/files/gasdynamics_rocketproject .pdf",
    },
    gallery: [
      "/images/projects/coldgas/Concept layout (Figure 1).png",
      "/images/projects/coldgas/Nozzle geometry (Figure 2).png",
      "/images/projects/coldgas/Rayleigh duct schematic (Figure 3) .png",
      "/images/projects/coldgas/Performance plots (Figures 4.png",
      "/images/projects/coldgas/Performance plots (Figures 5).png"
    ],
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
          `Achieved 92% total pressure recovery with the optimized two-ramp configuration. Nozzle design produced 15% higher thrust compared to baseline. Documented stable operation from Mach 2.0 to 3.0.

Mastered supersonic inlet design principles and shock-boundary layer interactions. Developed skills in design optimization and parametric CFD studies.`
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
          `LQR controller reduced RMS body acceleration by 45% compared to passive suspension. Achieved 30% reduction in suspension travel variance. Controller remained stable across ±20% parameter variations.

Gained practical experience in state-space modeling, controller design, and the trade-offs between competing performance objectives. Improved MATLAB/Simulink skills for control system simulation.`
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

export const coldGasCaptions = [
  "Concept layout (Figure 1)",
  "Nozzle geometry (Figure 2)",
  "Rayleigh duct schematic (Figure 3)",
  "Performance plot (Figure 4)",
  "Performance plot (Figure 5)"
];

// Move the following rendering code into your React component file (e.g., ProjectGallery.tsx):
// import { coldGasCaptions } from 'path/to/projects';
// 
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   {project.gallery.map((image, idx) => (
//     <div key={idx} className="text-center">
//       <img
//         src={image}
//         alt={`Project image ${idx + 1}`}
//         className="rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-2 w-full object-contain"
//         style={{ background: "#fff", maxHeight: 320 }}
//       />
//     </div>
//   ))}
// </div>

// Move the following JSX code into your React component file (e.g., ProjectGallery.tsx):
// <section className="mb-12">
//   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//     Digital Twin vs. Real Prototype
//   </h2>
//   {/* ...comparison images... */}
// </section>
