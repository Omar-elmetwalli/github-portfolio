export interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

export const profile = {
  name: "Omar Elmetwalli",
  title: "Aerospace Engineering • Scientific Machine Learning • CFD • Aerodynamics • Controls",
  /** One-line research identity used in the hero, metadata, and OG image. */
  tagline: "Physics-informed ML for turbulence & flow control",
  /** Short description for search results and link previews (~155 chars). */
  seoDescription:
    "Aerospace engineering researcher working on physics-informed machine learning for turbulence modeling, CFD, PIV, and flow control. Seeking PhD positions for Fall 2027.",
  availability: "Seeking PhD positions, Fall 2027",
  location: "Giza, Egypt",
  /** Primary contact address, used everywhere a single email is shown. */
  email: "omar.a.elmetwalli@gmail.com",
  /** Institutional addresses, listed in the contact section. */
  academicEmails: [
    { label: "AUC", address: "omar.elmetwalli@aucegypt.edu" },
    { label: "Zewail City", address: "s-omar.elmetwalli@zewailcity.edu.eg" },
  ],
  phone: "+20 10 2074 4196",
  linkedin: "https://linkedin.com/in/omar-elmetwally-ba272521b",
  github: "https://github.com/omar-elmetwalli",
  affiliation: {
    name: "University of Science and Technology (Zewail City)",
    url: "https://www.zewailcity.edu.eg",
    location: "Zewail City of Science and Technology, Giza, Egypt",
  },
  summary:
    "Aerospace Engineering student and researcher specializing in physics-informed machine learning, multiscale turbulence modeling, high-fidelity CFD, and experimental PIV flow diagnostics. Co-authoring research on ML-augmented turbulence with UT Dallas and Stevens Institute, investigating biological PDE gradient dynamics with University at Buffalo, incoming RA at AUC on PIV and topology optimization, R&D Engineer in turbomachinery (patent-pending), and Founder & Chair of Egypt's first AIAA Student Branch.",
  hero: {
    lead: "Aerospace Engineering student specializing in",
    highlight: "Physics-Informed Neural Networks (PINNs)",
    rest: ", multiscale turbulence modeling, high-fidelity CFD, and experimental PIV diagnostics.",
    sub: "Co-authoring research on ML-augmented turbulence with UT Dallas & Stevens Institute, investigating Keller–Segel PDE dynamics with Univ at Buffalo, incoming RA at AUC, and Founder & Chair of Egypt's first AIAA Student Branch.",
  },
  /**
   * Research-interest cards on the home page. `projects` are slugs shown as
   * related work. TODO(Omar): review the wording; it is drafted from
   * existing site content.
   */
  researchInterests: [
    {
      key: "closure",
      title: "ML turbulence closure",
      summary:
        "Physics-constrained deep learning for turbulence: neural operators and 3D U-Nets trained on high-fidelity LES/DNS data, with conservation laws built into the architecture rather than learned.",
      methods: ["Neural operators", "3D U-Nets", "JHTDB", "Wind-farm LES"],
      projects: ["ml-augmented-turbulence-modeling"],
    },
    {
      key: "surrogates",
      title: "Surrogate & reduced-order models",
      summary:
        "Fast predictions of aerodynamic flows from parametric CFD databases: Gaussian-process surrogates for force coefficients and PINNs that reconstruct full flow fields in milliseconds.",
      methods: ["OpenFOAM RANS", "GPR / Kriging", "PINNs"],
      projects: ["openfoam-parametric-airfoil-study", "joukowski-airfoil-aerodynamics"],
    },
    {
      key: "control",
      title: "Flow control & diagnostics",
      summary:
        "Measuring and manipulating flows: PIV experiments for flow-field characterization, suction-based flow control in turbomachinery R&D (patent-pending), and classical control of flight vehicles.",
      methods: ["PIV", "Suction devices", "State-space control"],
      projects: ["boeing-747-flight-dynamics-autopilot", "turbulent-pipe-flow-cfd"],
    },
  ],
  /** About-section paragraphs. Use **bold** for emphasis. */
  bio: [
    "I am an aerospace engineering researcher at the intersection of **computational fluid dynamics** and **scientific machine learning**. My research investigates how physical conservation laws, vorticity dynamics, and Navier–Stokes residuals can constrain deep neural operators and PINNs to achieve physically consistent, fast aerodynamic predictions.",
    "Alongside theoretical and numerical modeling, I have hands-on experimental experience with **Particle Image Velocimetry (PIV)** diagnostics for high-resolution flow measurement, as well as industrial R&D in turbomachinery suction devices (patent-pending).",
  ],
  collaborations: [
    { name: "UT Dallas & Stevens Institute", focus: "Physics-informed 3D U-Nets & turbulence datasets" },
    { name: "University at Buffalo", focus: "Biological Keller–Segel PDE gradient dynamics" },
    { name: "American University in Cairo (AUC)", focus: "PIV experimental flow diagnostics & topology optimization" },
    { name: "AIAA Student Branch", focus: "Founder & Chair, Egypt's first AIAA branch" },
  ],
  stats: [
    { value: 81, label: "Parametric RANS Cases", sublabel: "OpenFOAM v2306 (Camber & AoA Sweep)" },
    { value: 12000, suffix: "×", label: "PINN Speedup", sublabel: "< 5 ms GPU flow field reconstruction" },
    { value: 0.9992, decimals: 4, label: "GPR Surrogate R²", sublabel: "Multi-output aerodynamic force fidelity" },
    { value: 60, suffix: "+", label: "AIAA Branch Members", sublabel: "Founded Egypt's 1st Student Branch" },
  ] satisfies Stat[],
  competencies: [
    {
      icon: "🧠",
      title: "Scientific Machine Learning & PINNs",
      description:
        "Physics-Informed Neural Networks, Fourier Feature Embeddings, 3D U-Nets, Neural Operators (FNO), JHTDB datasets, Navier–Stokes loss enforcement, Kriging/GPR surrogates.",
    },
    {
      icon: "💨",
      title: "Computational Fluid Dynamics",
      description:
        "OpenFOAM v2306 (simpleFoam, blockMesh), ANSYS Fluent, RANS turbulence models (Spalart–Allmaras, SST k-ω), structured 5-block C-grids (y⁺ ≈ 1), boundary layer resolution.",
    },
    {
      icon: "🔬",
      title: "Experimental Flow Diagnostics",
      description:
        "Particle Image Velocimetry (PIV), optical laser diagnostics, experimental flow field reconstruction, camera calibration, topology optimization for thermal convection.",
    },
    {
      icon: "✈️",
      title: "Flight Dynamics & Control",
      description:
        "6-DOF state-space longitudinal & lateral equations of motion, modal analysis (short-period, phugoid, Dutch roll), classical autopilot synthesis (PID/PI), MIL-F-8785C compliance.",
    },
    {
      icon: "⚙️",
      title: "CAD, CAM & Turbomachinery",
      description:
        "Certified SolidWorks Associate (CSWA), Autodesk Inventor, 2-stage spur gearboxes, shafts, turbomachinery suction devices (patent-pending), manufacturing drawing GD&T.",
    },
    {
      icon: "💻",
      title: "Scientific Computing",
      description:
        "Python (PyTorch, NumPy, SciPy, Matplotlib), C++, MATLAB / Simulink, Linux / Bash scripting, OpenFOAM dictionary automation, Git / GitHub version control.",
    },
  ],
  skills: [
    "Scientific Machine Learning (Physics-Informed ML)",
    "Computational Fluid Dynamics (OpenFOAM, ANSYS Fluent)",
    "Particle Image Velocimetry (PIV) & Diagnostics",
    "Turbulence Modeling (LES, RANS, SST, SA)",
    "Deep Learning (PyTorch, Neural Operators, U-Nets)",
    "Flight Dynamics & Classical Control",
    "CAD/CAM (SolidWorks, Autodesk Inventor)",
    "Python, C++, MATLAB/Simulink",
  ],
  education: [
    {
      degree: "B.Sc. Aerospace Engineering",
      minor: "Minor in Communications & Information Engineering",
      institution: "University of Science and Technology (Zewail City)",
      location: "Giza, Egypt",
      period: "2022 — Expected Jun 2027",
      gpa: "3.303 / 4.00",
      gpaNote: "Top 10 Individual Rank in Class",
      coursework: [
        "Fluid Mechanics",
        "Gas Dynamics",
        "Aerodynamics",
        "Heat Transfer",
        "PDEs/ODEs",
        "Numerical Analysis",
        "Classical Control",
        "Continuum Mechanics",
        "Machine Design",
      ],
    },
  ],
  interests: [
    "Physics-Informed Deep Learning",
    "Turbulence & Vortex Dynamics",
    "Rocket & Air-Breathing Propulsion",
    "Experimental PIV Flow Diagnostics",
    "Topology Optimization",
    "Autonomous Aerospace Systems",
  ],
};
