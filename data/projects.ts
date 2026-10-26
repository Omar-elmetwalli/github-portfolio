export interface ProjectSection {
  title: string;
  content: string;
}

export const CATEGORIES = [
  "Scientific ML",
  "Fluid Mechanics & CFD",
  "Aerodynamics & Propulsion",
  "Dynamics & Controls",
  "Mechanical Design & Manufacturing",
  "Software & Computing",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Project {
  slug: string;
  title: string;
  date: string;
  /** Used by the project filter. Labels must come from CATEGORIES. */
  categories: Category[];
  tags: string[];
  tools: string[];
  summary: string;
  /** Shown large in "Selected research" on the home page. */
  featured?: boolean;
  confidential?: boolean;
  /** Shown instead of summary/sections when confidential is true. */
  publicSummary?: string;
  sections: ProjectSection[];
  links: {
    github?: string;
    demo?: string;
    paper?: string;
    paperTitle?: string;
    report?: string;
    reportTitle?: string;
  };
  gallery: string[];
}

export const projects: Project[] = [
  {
    "slug": "ml-augmented-turbulence-modeling",
    "featured": true,
    "categories": ["Scientific ML","Fluid Mechanics & CFD"],
    "title": "Physics-Informed Deep Learning & Neural Operators for Multiscale Turbulence Modeling",
    "date": "2024 \u2014 Present",
    "tags": [
      "Research",
      "Scientific Machine Learning",
      "CFD",
      "Turbulence",
      "Deep Learning",
      "Physics-Informed ML"
    ],
    "tools": [
      "PyTorch",
      "Python",
      "JHTDB",
      "MATLAB",
      "Spectral Methods",
      "FFT"
    ],
    "confidential": true,
    "publicSummary": "Developing physics-informed deep learning models (3D U-Nets and neural operators) for high-fidelity turbulence and wind-farm LES data, in collaboration with researchers at UT Dallas and Stevens Institute. A manuscript is in preparation; technical details will be shared after publication.",
    "summary": "Developing physics-informed deep learning architectures (including 3D U-Nets, Progressive Decoders, and Neural Operators) for high-fidelity turbulence datasets (Johns Hopkins Turbulence Databases) and wind-farm LES. Enforcing exact physical conservation laws: momentum-deficit conservation, actuator-line-model body-force conditioning, vorticity transport constraints, Leray projection, and adaptive correction modules. Co-authoring manuscript with Dr. Mahmoud Ayyad (Stevens Institute) and Ahmed Hamada (UT Dallas).",
    "sections": [
      {
        "title": "Research Overview & Physical Objectives",
        "content": "Conducting advanced computational research at the intersection of high-fidelity Computational Fluid Dynamics (CFD) and data-driven Deep Learning. Purely data-driven neural networks often violate basic fluid principles; this project tackles that challenge by building physics-informed architectures that enforce conservation of mass and momentum, Galilean invariance, and vorticity dynamics across complex wall-bounded and free-shear turbulent flows."
      },
      {
        "title": "Physics Constraints & Invariant Encodings",
        "content": "Developing network layers that incorporate exact physical inductive biases, including Leray projection for divergence-free velocity field enforcement, actuator-line-model body-force conditioning, and vorticity transport constraints. Analyzing spatial frequency characteristics via Fourier transforms (FFT) and progressive decoders to reconstruct subtle small-scale turbulent structures from high-dimensional datasets such as the Johns Hopkins Turbulence Databases (JHTDB)."
      },
      {
        "title": "Operator Learning & Comparative Analysis",
        "content": "Trained and benchmarked Neural Operator (NO) and Adversarial Neural Operator architectures against direct numerical simulation (DNS) ground truth. Evaluated spatial velocity fields, turbulent kinetic energy spectra, Velocity Gradient Tensor (VGT) invariants (Q and R), and coherent vortex structures to ensure the surrogate model faithfully generalizes across Reynolds numbers."
      },
      {
        "title": "Scholarly Manuscript & Confidentiality Notice",
        "content": "This work is part of an ongoing international research collaboration with Dr. Mahmoud Ayyad (Stevens Institute of Technology) and Ahmed Hamada (UT Dallas), targeting scholarly publication in 2026. Specific loss formulations, architectural configurations, and proprietary training datasets are confidential; presented here is a high-level conceptual summary alongside comparative validation media."
      }
    ],
    "links": {},
    "gallery": [
      "/images/projects/cfd-ml-turbulence/ground-truth.webp",
      "/images/projects/cfd-ml-turbulence/neural-operator.webp",
      "/images/projects/cfd-ml-turbulence/adv-neural-operator.webp",
      "/images/projects/cfd-ml-turbulence/cfd-ml-simulation.mp4"
    ]
  },
  {
    "slug": "openfoam-parametric-airfoil-study",
    "featured": true,
    "categories": ["Scientific ML","Fluid Mechanics & CFD","Aerodynamics & Propulsion"],
    "title": "Parametric NACA Airfoil OpenFOAM CFD Study, GPR Surrogates & Physics-Informed Neural Networks (PINN)",
    "date": "2024-11 — Present",
    "tags": [
      "CFD",
      "OpenFOAM",
      "Scientific Machine Learning",
      "PINN",
      "Physics-Informed ML",
      "Surrogate Modeling",
      "Aerodynamics",
      "RANS"
    ],
    "tools": [
      "OpenFOAM v2306",
      "PyTorch",
      "simpleFoam",
      "blockMesh",
      "Spalart-Allmaras RANS",
      "Python",
      "Scikit-Learn"
    ],
    "confidential": false,
    "summary": "Built an automated end-to-end parametric CFD pipeline in OpenFOAM across 81 cases (camber 1.0%–5.0% and AoA -2° to +14°) using structured 5-block C-grids and Spalart-Allmaras RANS. Developed both Gaussian Process surrogates for instant force predictions (R² = 0.9992) and a deep Parametric Physics-Informed Neural Network (PINN) predicting continuous 2D velocity, pressure, and eddy-viscosity fields in under 5 ms.",
    "sections": [
      {
        "title": "Automated OpenFOAM Pipeline & Mesh Generation",
        "content": "I structured the OpenFOAM pipeline across three core scripts to handle 81 aerodynamic cases without manual intervention. First, generate_cases.py computes NACA 4-digit analytical coordinates, writes customized blockMeshDict files with a closed trailing edge (yt = 0 at xi = 1.0 to avoid zero-volume cell collapse), sets the angle of attack through the freestream velocity vector (Ux = Uinf*cos(alpha), Uy = Uinf*sin(alpha)), and configures wind-axis drag/lift direction vectors for the forceCoeffs function object. Second, Allrun_Ubuntu.sh generates the structured mesh once per airfoil base case, copies polyMesh into each AoA sub-case to save disk time, and runs steady simpleFoam. Finally, extract_results.py parses the output force coefficients and builds clean CSV summaries and aerodynamic polars."
      },
      {
        "title": "5-Block Structured C-Grid & Numerical Schemes",
        "content": "To guarantee clean boundary-layer resolution and prevent skewed or degenerate cells, I developed a structured 5-block C-grid topology. The C-arc wraps continuously around the leading edge, eliminating collinear vertex errors and inverted blocks that often break multi-block grids at high camber. The mesh uses 60 cells along the airfoil profile, 70 along the wake, and 80 in the wall-normal direction with a 100:1 geometric grading, maintaining y+ ≈ 1 for the Spalart-Allmaras (SA) one-equation turbulence model. In fvSchemes and fvSolution, I used bounded second-order linearUpwind for momentum divergence, Gauss linear corrected for Laplacian schemes, and GAMG multigrid solvers with relaxation factors of 0.3 for pressure and 0.7 for velocity and nuTilda."
      },
      {
        "title": "Aerodynamic Sweep & Gaussian Process Surrogate",
        "content": "I conducted sweeps across 9 camber ratios (m = 1.0% to 5.0% in 0.5% increments, chord c = 1.0 m, t = 12%) and 9 angles of attack (alpha = -2° to +14° in 2° increments) at Uinf = 45 m/s ($Re \\approx 3.0 \\times 10^6$). From the 81 converged simulations, I extracted Cl, Cd, Cm, and L/D. In ml/, I trained and benchmarked multiple surrogate architectures (Gaussian Process Regression, MLPs, XGBoost, Random Forests) using 5-fold cross-validation. The Matérn-kernel Gaussian Process achieved R² = 0.9992 and an RMSE of 0.0062 for Cl, reproducing the linear lift slope, stall onset, and drag polar curves with sub-millisecond query times."
      },
      {
        "title": "Physics-Informed Neural Network (PINN) Flow Field Surrogate",
        "content": "To extend beyond point force prediction to full continuous flow field reconstruction, I formulated and trained a Parametric Physics-Informed Neural Network (pinn_study/) coupled directly to OpenFOAM cell-center solutions. The neural network maps spatial coordinates, camber percentage, and angle of attack (x, y, m, alpha) to velocity (u, v), kinematic pressure p, and kinematic eddy viscosity nu_t. To resolve sharp boundary layer gradients and overcome standard MLP spectral bias, the architecture uses random Fourier feature spatial embeddings coupled with residual blocks and smooth C² activations. The composite loss enforces supervised cell-center CFD observations, automatic differentiation-based steady incompressible Navier-Stokes continuity and momentum residuals, and airfoil wall no-slip boundary conditions."
      },
      {
        "title": "PINN Validation & 12,000x Inference Acceleration",
        "content": "I evaluated the trained PINN against 20 strictly held-out OpenFOAM test cases (alpha in {0°, 4°, 8°, 12°} across all 5 camber values). The network achieved an overall mean relative L2 velocity error of 11.08% and MAE of 2.58 m/s across the 45 m/s freestream, matching OpenFOAM CL with differences as low as Delta CL = -0.0076 in the linear aerodynamic regime. In evaluation, full continuous 2D flow fields evaluate in under 5 ms on a single GPU — delivering over 12,000x speedup compared to iterative OpenFOAM meshing and solver convergence."
      }
    ],
    "links": {
      "github": "https://github.com/Omar-elmetwalli/openfoam-airfoil-study",
      "paper": "/files/airfoil_study_paper.pdf",
      "paperTitle": "Read CFD & Surrogate Paper (PDF)",
      "report": "/files/PINN_OpenFOAM_Airfoil_Report.pdf",
      "reportTitle": "Read PINN Research Report (PDF)"
    },
    "gallery": [
      "/images/projects/openfoam-airfoil-study/aerodynamic-polars-comparison.webp",
      "/images/projects/openfoam-airfoil-study/velocity-field-comparison-m2-0-aoa4.webp",
      "/images/projects/openfoam-airfoil-study/pressure-field-comparison-m2-0-aoa4.webp",
      "/images/projects/openfoam-airfoil-study/training-convergence.webp",
      "/images/projects/openfoam-airfoil-study/parity-plots.webp",
      "/images/projects/openfoam-airfoil-study/ml-vs-cfd-drag-polar.webp",
      "/images/projects/openfoam-airfoil-study/ml-vs-cfd-cl-vs-aoa.webp",
      "/images/projects/openfoam-airfoil-study/cl-vs-aoa.webp",
      "/images/projects/openfoam-airfoil-study/cd-vs-aoa.webp",
      "/images/projects/openfoam-airfoil-study/cm-vs-aoa.webp"
    ]
  },
  {
    "slug": "boeing-747-flight-dynamics-autopilot",
    "categories": ["Dynamics & Controls","Aerodynamics & Propulsion"],
    "title": "Boeing 747 Flight Dynamics \u2014 Modal Stability & Classical Autopilot Design",
    "date": "2026-03",
    "tags": [
      "Flight Dynamics",
      "Aerospace Controls",
      "State-Space",
      "Aerodynamics",
      "Simulation"
    ],
    "tools": [
      "MATLAB",
      "Simulink",
      "Control System Toolbox"
    ],
    "summary": "Derived and analyzed 6-DOF linearized state-space longitudinal and lateral-directional flight dynamics for a Boeing 747 at Mach 0.5 and 20,000 ft. Conducted modal analysis (short-period, phugoid, roll subsidence, Dutch roll, spiral), verified full vs. reduced-order approximations, and synthesized longitudinal pitch PID and lateral roll PI attitude autopilots.",
    "sections": [
      {
        "title": "Flight Condition & Aerodynamic Derivatives",
        "content": "Consolidated NASA CR-2144 handling qualities data for a Boeing 747 at flight condition #5 (Mach 0.5, altitude 20,000 ft, U0 = 518 ft/s, weight = 636,636 lbf, mass = 19,786.1 slugs). Computed dynamic pressure (q_bar = 170.02 lbf/ft^2) and non-dimensionalized all stability and control derivatives. Scaled longitudinal and lateral force/moment derivatives and accounted for inertial cross-coupling caused by the non-zero product of inertia (I_xz = 970,056 slug-ft^2) via primed derivatives (L_p prime, N_r prime)."
      },
      {
        "title": "Longitudinal & Lateral Modal Analysis",
        "content": "Constructed the 4x4 longitudinal state-space matrix (u, w, q, theta) and extracted eigenvalues to reveal the fast, well-damped Short-Period pitching mode ($\\omega_n$ = 0.997 rad/s, $\\zeta$ = 0.421, Ts = 9.52 s) and slow, lightly damped Phugoid energy exchange mode ($\\omega_n$ = 0.0878 rad/s, $\\zeta$ = 0.047, Ts = 970 s). Formulated the 4x4 lateral-directional state-space model (v, p, r, phi) and computed the heavily convergent Roll Subsidence mode ($\\tau$ = 0.861 s), lightly damped Dutch Roll oscillation ($\\omega_n$ = 1.513 rad/s, $\\zeta$ = 0.0387), and slow Spiral mode ($\\tau$ = 238.1 s). Evaluated compliance against MIL-F-8785C criteria, showing unaugmented Dutch roll damping falls well below the 0.08 minimum, confirming the need for stability augmentation."
      },
      {
        "title": "Full-System vs. Reduced-Order Approximations",
        "content": "Formulated 2x2 reduced-order approximations for Short-Period (w, q), Phugoid (u, theta), and Dutch Roll (v, r), plus 1st-order models for Rolling and Spiral modes. Simulated responses under a 1-degree angle-of-attack gust disturbance and elevator/rudder step inputs. Short-period approximation tracked the initial 10 seconds of response with high fidelity, while Dutch roll approximation captured frequency accurately but overestimated damping ratio ($\\zeta$ = 0.0883 vs. 0.0387) due to omitted roll-rate cross-coupling relief."
      },
      {
        "title": "Classical Longitudinal & Lateral Autopilot Design",
        "content": "Synthesized closed-loop single-loop attitude hold autopilots to stabilize the problematic long-period flight modes. For longitudinal pitch attitude hold, designed a PID controller with gains Kp = -0.6500, Ki = -0.0871, Kd = -0.3850, commanding elevator deflection from pitch-angle error to strongly suppress phugoid oscillations. For lateral roll attitude hold, implemented a PI controller with gains Kp = 0.0191, Ki = 0.000304, shifting the slow spiral pole deeper into the stable left-half plane to provide fast, tight roll stabilization."
      }
    ],
    "links": {
      "paper": "/files/Flight_Dynamics_Project.pdf"
    },
    "gallery": [
      "/images/projects/flight-dynamics/fig04-sp-q-initial.webp"
    ]
  },
  {
    "slug": "joukowski-airfoil-aerodynamics",
    "featured": true,
    "categories": ["Aerodynamics & Propulsion","Fluid Mechanics & CFD"],
    "title": "Joukowski Airfoil Aerodynamics \u2014 Conformal Mapping Potential Flow vs. CFD",
    "date": "2025-11",
    "tags": [
      "Aerodynamics",
      "CFD",
      "Theoretical Aerodynamics",
      "Simulation"
    ],
    "tools": [
      "MATLAB",
      "ANSYS Fluent",
      "Fluid Flow (Fluent)"
    ],
    "summary": "Developed analytical potential flow modeling of a cambered Joukowski airfoil via complex conformal transformation (z = zeta + b^2/zeta). Computed surface velocities, pressure coefficient (Cp) distribution, and lift/pitching moments across an angle-of-attack sweep (-5 deg to +10 deg), benchmarked against high-fidelity ANSYS Fluent CFD simulations.",
    "sections": [
      {
        "title": "Conformal Mapping Potential Flow Formulation",
        "content": "Applied Joukowski conformal mapping to transform flow past a circular cylinder in the complex zeta-plane into flow past a cambered, thickened airfoil profile in the physical z-plane (chord = 1.25 m, max thickness t/c = 10%, max camber = 4.5%, V_inf = 125 m/s). Derived circle radius, eccentricity shift (x0 = -b*e), and camber center angle (beta = 2*max_camber) enforcing the Kutta condition to fix circulation Gamma such that the trailing edge is a smooth stagnation point."
      },
      {
        "title": "Analytical Velocity & Pressure Evaluation",
        "content": "Derived closed-form expressions for upper and lower surface tangential velocities $V_u(\\theta)$ and $V_l(\\theta)$ as functions of cylinder angle. Computed non-dimensional pressure coefficient distributions $C_p = 1 - (V/V_\\infty)^2$. Implemented numerical contour integration along upper and lower surfaces to determine sectional lift coefficient (CL), quarter-chord pitching moment ($C_{m,c/4}$), and leading-edge moment ($C_{m,LE}$) across an alpha sweep from -5 deg to 10 deg."
      },
      {
        "title": "CFD Benchmark & Aerodynamic Correlation",
        "content": "Created structured 2D computational fluid domains in ANSYS Fluent to model viscous flow past the identical Joukowski geometry. Extracted wall surface pressure profiles, velocity vectors, and streamlines. Compared analytical potential flow predictions against viscous Navier-Stokes CFD results, analyzing boundary layer displacement thickness effects, leading-edge suction peak magnitude, and viscous pressure drag."
      }
    ],
    "links": {},
    "gallery": [
      "/images/projects/joukowski-airfoil/cp.webp",
      "/images/projects/joukowski-airfoil/airfoil.webp",
      "/images/projects/joukowski-airfoil/v.webp",
      "/images/projects/joukowski-airfoil/aa.webp"
    ]
  },
  {
    "slug": "turbulent-pipe-flow-cfd",
    "categories": ["Fluid Mechanics & CFD"],
    "title": "Turbulent Pipe Flow CFD \u2014 k-omega SST Boundary Layer & Entrance Length Simulation",
    "date": "2024-12",
    "tags": [
      "CFD",
      "Turbulence Modeling",
      "Fluid Mechanics",
      "Simulation"
    ],
    "tools": [
      "ANSYS Fluent",
      "ANSYS Meshing",
      "DesignModeler"
    ],
    "summary": "Performed 2D axisymmetric CFD simulations in ANSYS Fluent to investigate hydrodynamic entrance length (Le), boundary layer growth, and turbulent shear stress in 20 m and 30 m circular pipes using the k-omega SST turbulence model, achieving full convergence after 664 iterations.",
    "sections": [
      {
        "title": "Computational Setup & Mesh Inflation",
        "content": "Modeled a circular pipe (diameter D = 1 m, lengths L = 20 m and 30 m) under uniform inlet velocity (1 m/s, $Re = 10^6$) with 4.8% inlet turbulence intensity. Generated a fine 2D axisymmetric grid with 100 axial divisions and 50 radial divisions, applying a 10.0 bias factor toward the pipe wall to properly resolve the near-wall laminar sublayer (y+ <= 1)."
      },
      {
        "title": "Turbulence Closure & Solver Selection",
        "content": "Employed the two-equation k-omega Shear Stress Transport (SST) turbulence model to accurately resolve the viscous sublayer, buffer zone, and turbulent log-law overlap layer without relying on standard wall functions. Enabled pressure-velocity coupled solver with second-order upwind discretization for momentum and turbulent transport equations."
      },
      {
        "title": "Entrance Length & Shear Stress Results",
        "content": "Tracked centerline axial velocity and boundary layer development downstream of the pipe inlet. Verified that the boundary layers merge and the flow achieves fully developed conditions between 22 m and 25 m, matching the empirical turbulent entrance length relation Le/D = 4.4 * Re_D^(1/6). Evaluated wall shear stress profiles, turbulent kinetic energy dissipation rate, skin friction factor, and y+ distribution along the pipe."
      }
    ],
    "links": {
      "paper": "/files/Turbulent_Flow_CFD_Report.pdf"
    },
    "gallery": [
      "/images/projects/turbulent-pipe-flow/wall-shear-stress.webp",
      "/images/projects/turbulent-pipe-flow/dissipation-rate.webp",
      "/images/projects/turbulent-pipe-flow/flow-developed.webp",
      "/images/projects/turbulent-pipe-flow/skin-friction-factor.webp",
      "/images/projects/turbulent-pipe-flow/yplus-wall.webp"
    ]
  },
  {
    "slug": "cold-gas-rocket-engine",
    "categories": ["Aerodynamics & Propulsion"],
    "title": "Cold Gas Rocket Engine \u2014 Nozzle Design & Blowdown Simulation",
    "date": "2026-01",
    "tags": [
      "Propulsion",
      "Thermodynamics",
      "Simulation",
      "Gas Dynamics"
    ],
    "tools": [
      "MATLAB"
    ],
    "summary": "Designed and simulated a blowdown cold-gas rocket engine using 1D compressible-flow relations. Sized a CD nozzle at P0=100 bar, T0=2200 K (perfect expansion), then coupled a time-marching adiabatic tank model to predict pressure/temperature, mass flow, and thrust vs time (with a Rayleigh heat-addition extension).",
    "sections": [
      {
        "title": "Problem",
        "content": "Design a blowdown cold-gas rocket engine and predict transient performance using gas-dynamics fundamentals (choking, nozzle expansion, and adiabatic tank discharge)."
      },
      {
        "title": "Approach",
        "content": "Sized a CD nozzle at 100 bar / 2200 K with perfect expansion. Built a time-marching adiabatic rigid-tank model coupled to a choked nozzle to compute Pt(t), Tt(t), m_dot(t), and thrust. Added a constant-area Rayleigh heat-addition duct to capture stagnation-pressure losses and sized a combustor diameter for a low inlet Mach number."
      },
      {
        "title": "Results",
        "content": "Design point: P0,d = 100 bar, T0,d = 2200 K, perfect expansion to ambient. Tank initial: Pt,0 = 200 bar, Tt,0 = 300 K, Vt = 0.5 m^3, working gas: air. Final nozzle sizing: Dt = 20.0 mm, $M_e = 3.68$, $A_e/A_t = 8.05$, De = 56.7 mm, Design thrust \u2248 4865 N (\u2248 4.87 kN)."
      }
    ],
    "links": {
      "paper": "/files/gasdynamics_rocketproject.pdf"
    },
    "gallery": [
      "/images/projects/cold-gas/concept-layout-figure-1.webp",
      "/images/projects/cold-gas/nozzle-geometry-figure-2.webp",
      "/images/projects/cold-gas/rayleigh-duct-schematic-figure-3.webp",
      "/images/projects/cold-gas/performance-plots-figures-4.webp",
      "/images/projects/cold-gas/performance-plots-figures-5.webp"
    ]
  },
  {
    "slug": "ramjet-engine-inlet-optimization",
    "categories": ["Aerodynamics & Propulsion"],
    "title": "Ramjet Engine \u2014 Two-Ramp Inlet & Nozzle Optimization",
    "date": "2024-01",
    "tags": [
      "Propulsion",
      "Optimization",
      "Gas Dynamics",
      "Supersonic Aerodynamics"
    ],
    "tools": [
      "MATLAB"
    ],
    "summary": "Optimized a fixed-geometry two-ramp supersonic inlet and choked C\u2013D nozzle for a ramjet at Mach 2.75, maximizing net thrust while maintaining strong total-pressure recovery within a 25x25 cm cross-section.",
    "sections": [
      {
        "title": "Problem",
        "content": "Design a ramjet flowpath (two-ramp inlet, diffuser, Rayleigh-flow combustor, and nozzle) constrained to a 25x25 cm square cross-section. The inlet must provide high total-pressure recovery, while the nozzle/combustor settings maximize net thrust at the Mach 2.75 design condition."
      },
      {
        "title": "Approach",
        "content": "Built a MATLAB-based ramjet cycle model with an oblique\u2013oblique\u2013normal inlet, isentropic diffuser, Rayleigh-flow combustor (with additional total-pressure loss), and a quasi-1D choked converging\u2013diverging nozzle. Performed a robust grid search over ramp angles and nozzle sizing under attached-shock and geometric constraints, then evaluated fixed-geometry off-design behavior at Mach 2.0 and Mach 4.0."
      },
      {
        "title": "Results",
        "content": "Optimized ramp angles to $\\theta_1 = 14.5^\\circ$ and $\\theta_2 = 17.5^\\circ$, achieving intake total-pressure recovery $P_{t3}/P_{t0} = 0.8086$ (~81%). At the Mach 2.75 design point the engine produced ~6.26 kN net thrust (m_dot = 9.88 kg/s; specific thrust = 633 N/(kg/s)) within the 25x25 cm envelope (At = 0.0562 m^2, Ae = 0.0625 m^2). Off-design analysis showed unstart at Mach 2.0 and strong high-speed potential at Mach 4.0 reaching 13.67 kN maximum net thrust at Tt5 = 2200 K."
      }
    ],
    "links": {
      "paper": "/files/gasdynamics_ramjet_project.pdf"
    },
    "gallery": [
      "/images/projects/ramjet/ramjet-inlet.webp"
    ]
  },
  {
    "slug": "3dof-planar-robotic-arm",
    "categories": ["Mechanical Design & Manufacturing"],
    "title": "3-DOF Planar Robotic Arm \u2014 Design, Kinematics & Prototype",
    "date": "2025-12",
    "tags": [
      "Robotics",
      "Kinematics",
      "CAD",
      "Mechatronics",
      "Prototyping"
    ],
    "tools": [
      "SolidWorks",
      "MATLAB",
      "Arduino",
      "3D Printing"
    ],
    "summary": "Designed, modeled, and built a low-cost 3-DOF planar robotic arm. Derived analytical FK/IK, built a MATLAB \u201cdigital twin\u201d GUI for interactive control + safety checks, and drove SG90 servos via Arduino; validated performance with LiDAR measurements.",
    "sections": [
      {
        "title": "Problem",
        "content": "Build a low-cost 3-DOF manipulator that demonstrates the full pipeline from kinematic modeling to a working prototype, with safe interactive control via a GUI."
      },
      {
        "title": "Approach",
        "content": "Derived analytical forward/inverse kinematics and verified them in a custom MATLAB digital twin (no robotics toolbox). Implemented safety checks (reachability + floor collision clamp + servo limit validation), then sent commands to an Arduino Uno driving SG90 servos using microsecond-level PWM mapping and trajectory smoothing. Designed a lightweight truss arm in CAD, exported DXF, and laser-cut 3mm plywood for fabrication and assembly."
      },
      {
        "title": "Results",
        "content": "Achieved a functional prototype with real-time GUI control and stable motion. Load analysis showed a comfortable torque margin at the shoulder joint (Safety Factor \u2248 4.6). Validation using LiDAR measurements compared multiple target poses between the digital twin and the physical arm."
      }
    ],
    "links": {
      "paper": "/files/Mechatronics_Project_Report.pdf"
    },
    "gallery": [
      "/images/projects/robotic-arm/gui.webp",
      "/images/projects/robotic-arm/assembled.webp"
    ]
  },
  {
    "slug": "active-suspension-lqr",
    "categories": ["Dynamics & Controls"],
    "title": "Active Suspension (Quarter-Car) \u2014 State Feedback & LQR",
    "date": "2023-11",
    "tags": [
      "Controls",
      "Simulation",
      "Dynamics",
      "Optimal Control"
    ],
    "tools": [
      "MATLAB",
      "Simulink",
      "Control System Toolbox"
    ],
    "summary": "Modeled a quarter-car active suspension system and designed LQR and state feedback controllers to minimize body acceleration and suspension travel.",
    "sections": [
      {
        "title": "Problem",
        "content": "Design an active suspension controller that improves ride comfort (minimizes body acceleration) while maintaining acceptable suspension travel and tire contact."
      },
      {
        "title": "Approach",
        "content": "Developed a 2-DOF quarter-car model with sprung and unsprung masses. Designed state feedback and LQR controllers with different weighting matrices. Simulated response to road disturbances including bumps and random road profiles."
      },
      {
        "title": "Results",
        "content": "LQR controller reduced RMS body acceleration by 45% compared to passive suspension. Achieved 30% reduction in suspension travel variance. Controller remained stable across \u00b120% parameter variations."
      }
    ],
    "links": {},
    "gallery": []
  },
  {
    "slug": "aquaponic-system-fluid-mechanics",
    "categories": ["Fluid Mechanics & CFD","Mechanical Design & Manufacturing"],
    "title": "Aquaponic Recirculating System \u2014 Fluid Mechanics Modeling & Hydraulic Sizing",
    "date": "2024-05",
    "tags": [
      "Fluid Mechanics",
      "Hydraulics",
      "CAD",
      "System Engineering"
    ],
    "tools": [
      "AutoCAD",
      "SolidWorks",
      "Engineering Calculations"
    ],
    "summary": "Engineered a closed-loop recirculating aquaponics facility (fish tank, grow beds, biofilter, radial flow clarifier). Derived analytical fluid mechanics models for automatic Bell Siphon cyclical dosing, sized Venturi aeration and flowmeter devices per ASME MFC-3M-2004, and completed 2D CAD engineering drawings, viscometer experimental validations, and market bill of materials.",
    "sections": [
      {
        "title": "Problem & System Architecture",
        "content": "Designed an eco-friendly food-production aquaponics system within a 3 m^2 footprint, integrating a 1000 L fish habitat, solid waste radial flow separator, aerobic biofiltration unit, and agricultural grow beds with automated flood-and-drain cycles."
      },
      {
        "title": "Bell Siphon Fluid Dynamics Modeling",
        "content": "Derived mass conservation and Bernoulli equations to compute minimum trap diameter Dt \u2248 30 mm and bell diameter Db = 1.7 Dt \u2248 51 mm, weir height hb = 0.7 Db, ensuring automatic initiation and breaking of the siphon effect under a maximum design flow rate of 5 L/min (300 L/h)."
      },
      {
        "title": "Venturi Flowmeter & Aeration Sizing",
        "content": "Applied ASME MFC-3M-2004 standards at Re = 10^5 to calculate Venturi constriction geometry (converging/diverging lengths 140 mm, throat diameter 20 mm, discharge coefficient Cd = 0.99). Optimized Venturi suction for microbubble oxygenation in the fish tank."
      },
      {
        "title": "CAD Drawings & Experimental Validation",
        "content": "Generated multi-view engineering drawings (Front, Side, Top views) with full piping schematics and conducted fluid viscometer experiments for fluid property characterization, accompanied by comprehensive economic analysis totaling \u2248 \\$1900."
      }
    ],
    "links": {
      "paper": "/files/ENGR207_Aquaponics_Project_Report.pdf"
    },
    "gallery": [
      "/images/projects/aquaponic-system/aquaponic-system.webp",
      "/images/projects/aquaponic-system/viscometer-cad.webp",
      "/images/projects/aquaponic-system/viscometer-1.webp",
      "/images/projects/aquaponic-system/viscometer-2.webp",
      "/images/projects/aquaponic-system/viscometer-experiment.mp4"
    ]
  },
  {
    "slug": "two-stage-gearbox-design",
    "categories": ["Mechanical Design & Manufacturing"],
    "title": "Two-Stage Industrial Speed Multiplier / Reducer Gearbox Design & Drafting",
    "date": "2025-05",
    "tags": [
      "Mechanical Design",
      "CAD",
      "Machine Elements",
      "Engineering Drafting"
    ],
    "tools": [
      "SolidWorks",
      "Autodesk Inventor",
      "AGMA Standards"
    ],
    "summary": "Designed and drafted an industrial two-stage heavy-duty gearbox rated at 25 kW/HP (input speed 120 rpm, output speed 1800 rpm). Performed spur gear tooth stress sizing, multi-shaft stepped layouts, SKF angular contact bearing selection, DIN 3760 oil sealing, and full Section A-A exploded drafting.",
    "sections": [
      {
        "title": "Kinematic Sizing & Gear Train",
        "content": "Sized a two-stage spur gear transmission for 1:15 ratio operation at 25 kW power rating. Computed pitch diameters, center distances, module, face widths, and tooth contact stresses to prevent pitting and root bending fatigue."
      },
      {
        "title": "Shaft & Bearing Architecture",
        "content": "Designed three stepped shafts (Shafts A, B, C) accommodating keys, gear hubs, and SKF angular contact ball bearings (SKF 7213, 7210, 7206, 7207) sized for combined radial and thrust reactions. Integrated DIN 3760 NBR shaft seal rings to prevent lubricant leakage."
      },
      {
        "title": "Engineering Assembly Drafting & BOM",
        "content": "Produced standard engineering production drawings featuring Section A-A, detailed cross-sections (Details B, C, D, E), and a complete 30-item Bill of Materials (BOM) including casing covers, gaskets, and standard DIN 933 / DIN 6921 fasteners."
      }
    ],
    "links": {
      "paper": "/files/Two_Stage_Gearbox_Drawing.pdf"
    },
    "gallery": []
  },
  {
    "slug": "shaft-assembly-power-transmission",
    "categories": ["Mechanical Design & Manufacturing"],
    "title": "Power Transmission Drive Shaft Assembly \u2014 Exploded View & BOM Drafting",
    "date": "2024-12",
    "tags": [
      "Mechanical Design",
      "CAD",
      "Engineering Drafting",
      "Machine Elements"
    ],
    "tools": [
      "SolidWorks",
      "AutoCAD",
      "ISO Standards"
    ],
    "summary": "Designed a high-reliability drive shaft assembly integrating a 50-tooth spur gear, V-belt pulley, dual SKF 6204 deep-groove ball bearings, parallel keys, and protective end covers. Produced a formal engineering drawing sheet with exploded 3D CAD views and parts list.",
    "sections": [
      {
        "title": "Mechanical Drive Layout",
        "content": "Designed a unified transmission shaft transmitting torque between a V-belt pulley drive and a DIN standard spur gear (2M 50T 20PA 22FW)."
      },
      {
        "title": "Bearing & Fastener Integration",
        "content": "Selected dual SKF 6204 ball bearings supporting the main rotating shaft with precision end-cover retainers and ISO 4014 M6x30 hex bolts. Sized parallel keys (key1, key2) for shear and crushing stress safety margins."
      },
      {
        "title": "3D CAD Exploded Drawing Sheet",
        "content": "Drafted an engineering drawing sheet with 3D exploded projection, balloon numbering, and itemized component parts list."
      }
    ],
    "links": {
      "paper": "/files/Shaft_Assembly_Drawing.pdf"
    },
    "gallery": []
  },
  {
    "slug": "rocket-workshop-cnc-machining",
    "categories": ["Mechanical Design & Manufacturing"],
    "title": "DMU 50 5-Axis CNC Machining & Process Planning for Rocket Workpieces",
    "date": "2024-03",
    "tags": [
      "Manufacturing",
      "CAM",
      "CNC Machining",
      "Production Engineering"
    ],
    "tools": [
      "DMU 50 5-Axis CNC",
      "G-Code",
      "Process Planning"
    ],
    "summary": "Formulated comprehensive process plans and cutting parameter optimization for rocket nosecone and structural workpieces on a DMU 50 5-axis CNC machining center. Sequenced facing, straight turning, contouring, internal/external threading, grooving, and chamfering with MRR and cycle time calculations.",
    "sections": [
      {
        "title": "Component Analysis & Tooling Selection",
        "content": "Analyzed aerospace-grade aluminum rocket workpieces with complex conical aerodynamic profiles and threaded interfaces. Selected specialized tooling for the DMU 50 CNC, including facing cutters, carbide turning tools, contouring inserts, and threading tools."
      },
      {
        "title": "Process Sequencing & Toolpath Planning",
        "content": "Formulated ordered manufacturing sequences: Workpiece 1 (Facing -> Straight Turning -> Contouring -> External Threading -> Grooving -> Chamfering) and Workpiece 2 (including internal/external threading and radial grooving)."
      },
      {
        "title": "Machining Speed, Feed & MRR Optimization",
        "content": "Computed cutting operations at a spindle speed of 2650 rpm. Optimized feed rates (0.03 to 0.20 in/rev), tool engagement times (0.2 to 0.5 min), and total Material Removal Rates (MRR = 0.792 in^3/rev and 0.682 in^3/rev)."
      }
    ],
    "links": {
      "paper": "/files/Manufacturing_Rocket_Components_Report.pdf"
    },
    "gallery": []
  },
  {
    "slug": "inverted-pendulum-segway-control",
    "categories": ["Dynamics & Controls"],
    "title": "Segway Inverted Pendulum Mobile Robot \u2014 Root Locus Control & Pole Placement",
    "date": "2024-04",
    "tags": [
      "Controls",
      "Robotics",
      "Dynamics",
      "Simulation"
    ],
    "tools": [
      "MATLAB",
      "Simulink",
      "Control System Toolbox"
    ],
    "summary": "Derived equations of motion for an unstable inverted pendulum Segway vehicle G(s) = -0.1533/(s^2 - 11.841), designed Root Locus pole-placement feedback compensation to achieve target damping $\\zeta$ = 0.451 and natural frequency $\\omega_n$ = 21.9 rad/s, and validated stability in Simulink.",
    "sections": [
      {
        "title": "Dynamical Modeling & Open-Loop Instability",
        "content": "Formulated linearized equations of motion for the mobile two-wheeled inverted pendulum cart-pendulum system. Identified the open-loop unstable right-half-plane pole pair at $s = \\pm 3.441$ rad/s resulting from gravitational destabilization."
      },
      {
        "title": "Root Locus Compensation & Gain Calculation",
        "content": "Plotted root locus in MATLAB and synthesized a feedback compensator placing closed-loop poles at desired locations $s_0 = -10 \\pm 19.5j$, achieving damping ratio $\\zeta$ = 0.451 and rapid settling. Computed exact critical gain $K_u = 1/|G(s_0)|$ and verified pole stability."
      },
      {
        "title": "Simulink Dynamic Validation",
        "content": "Built open-loop and closed-loop block diagrams in Simulink (segway_openloop.slx) to simulate vehicle response under initial pitch tilt disturbances and step torque inputs."
      }
    ],
    "links": {},
    "gallery": []
  },
  {
    "slug": "hospital-logistics-data-structures",
    "categories": ["Software & Computing"],
    "title": "Multi-Hospital Emergency Dispatch & Patient Triage \u2014 C++ Object-Oriented Simulation",
    "date": "2024-05",
    "tags": [
      "Software",
      "Data Structures",
      "Algorithms",
      "C++",
      "Simulation"
    ],
    "tools": [
      "C++",
      "Object-Oriented Programming",
      "Visual Studio"
    ],
    "summary": "Developed a discrete-event logistics simulation engine in C++ for emergency dispatch across multiple interconnected hospitals. Built custom templated Priority Queues and Linked Queues to handle triage (Emergency, Special, Normal patients), dynamic distance matrix vehicle routing, and fleet utilization optimization.",
    "sections": [
      {
        "title": "Architecture & Custom Data Structures",
        "content": "Implemented clean object-oriented architecture without reliance on standard STL container overhead, developing custom generic templated LinkedQueue<T> and priQueue<T> classes to manage patient admissions, car assignments, and cancellations."
      },
      {
        "title": "Triage Classification & Dynamic Dispatch",
        "content": "Engineered triage priority sorting allocating Normal (NP), Special (SP), and Emergency (EP) patients. Modeled specialized emergency vehicles (Normal vs. Special cars) dispatched dynamically based on inter-hospital distance matrices."
      },
      {
        "title": "Fleet Analytics & Output Optimization",
        "content": "Tracked real-time performance indicators including patient waiting times, vehicle busy times, total utilization percentages, and hospital load balancing across up to 100 hospital nodes."
      }
    ],
    "links": {},
    "gallery": []
  },
  {
    "slug": "variational-quantum-classifier",
    "categories": ["Software & Computing"],
    "title": "Variational Quantum Classifier (VQC) \u2014 Quantum Circuit Machine Learning",
    "date": "2024-06",
    "tags": [
      "Quantum Computing",
      "Machine Learning",
      "Qiskit",
      "Python"
    ],
    "tools": [
      "Python",
      "Qiskit",
      "Qiskit Machine Learning",
      "Scikit-Learn"
    ],
    "summary": "Implemented a Quantum Machine Learning (QML) pipeline using Qiskit. Reduced high-dimensional feature vectors via Principal Component Analysis (PCA), encoded data into quantum Hilbert space using the ZZFeatureMap circuit, and trained a parameterized RealAmplitudes variational ansatz with COBYLA optimization.",
    "sections": [
      {
        "title": "High-Dimensional Preprocessing & PCA",
        "content": "Processed high-dimensional dataset features, performing data cleaning, normalization, and Principal Component Analysis (PCA) to project input features down to 5 orthogonal components suitable for near-term quantum circuit simulation."
      },
      {
        "title": "Quantum Feature Mapping & Variational Ansatz",
        "content": "Constructed a 5-qubit quantum circuit utilizing ZZFeatureMap with full two-qubit entanglement to capture non-linear feature interactions in quantum phase space. Attached a parameterized RealAmplitudes variational ansatz consisting of alternating single-qubit rotations and entangling CNOT gates."
      },
      {
        "title": "Quantum Primitive Execution & Optimization",
        "content": "Executed quantum circuit evaluations using Qiskit Sampler primitive. Optimized circuit rotation angles via the derivative-free COBYLA optimizer, tracking cost function convergence and evaluating classification accuracy on training and test splits."
      }
    ],
    "links": {},
    "gallery": []
  },
  {
    "slug": "balsa-wood-glider-prototype",
    "categories": ["Aerodynamics & Propulsion"],
    "title": "Hand-Launched Balsa Wood Glider \u2014 Aerodynamic Design & Flight Prototyping",
    "date": "2023-12",
    "tags": [
      "Aerodynamics",
      "Prototyping",
      "Flight Testing",
      "Aerospace Engineering"
    ],
    "tools": [
      "Balsa Wood",
      "Hand Tools",
      "Flight Testing",
      "Aerodynamic Sizing"
    ],
    "summary": "Designed, fabricated, and flight-tested an unpowered hand-launched balsa glider. Engineered polyhedral wing tips for lateral-directional dihedral effect and spiral stability, balanced longitudinal center of gravity with nose ballast, and optimized glide ratio.",
    "sections": [
      {
        "title": "Aerodynamic Sizing & Wing Geometry",
        "content": "Sized high-aspect-ratio rectangular wing with polyhedral tip angles to ensure passive roll stability and Dutch roll damping during unguided free flight at low Reynolds numbers ($Re < 10^5$)."
      },
      {
        "title": "Airframe Construction & Balances",
        "content": "Handcrafted the airframe from lightweight balsa wood, sanding an aerodynamic cambered airfoil profile. Integrated a rigid fuselage boom, balanced horizontal tailplane and vertical fin area ratios, and installed a contoured nose ballast for neutral longitudinal stability margin."
      },
      {
        "title": "Flight Test Validation",
        "content": "Conducted glide tests to adjust elevator trim tab angles and center-of-gravity placement, achieving flat, stable glide trajectories and long flight duration."
      }
    ],
    "links": {},
    "gallery": [
      "/images/projects/glider/glider-prototype.webp"
    ]
  }
];

/**
 * Projects safe to show publicly. Confidential projects keep only their
 * publicSummary: the detailed summary and sections never leave the server.
 */
export const getPublicProjects = (): Project[] =>
  projects.map((p) =>
    p.confidential
      ? { ...p, summary: p.publicSummary ?? "Details available after publication.", sections: [] }
      : p
  );

export const getPublicProjectBySlug = (slug: string): Project | undefined =>
  getPublicProjects().find((p) => p.slug === slug);
