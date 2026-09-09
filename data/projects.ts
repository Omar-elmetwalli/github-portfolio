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
    "slug": "boeing-747-flight-dynamics-autopilot",
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
        "content": "Constructed the 4x4 longitudinal state-space matrix (u, w, q, theta) and extracted eigenvalues to reveal the fast, well-damped Short-Period pitching mode (omega_n = 0.997 rad/s, zeta = 0.421, Ts = 9.52 s) and slow, lightly damped Phugoid energy exchange mode (omega_n = 0.0878 rad/s, zeta = 0.047, Ts = 970 s). Formulated the 4x4 lateral-directional state-space model (v, p, r, phi) and computed the heavily convergent Roll Subsidence mode (tau = 0.861 s), lightly damped Dutch Roll oscillation (omega_n = 1.513 rad/s, zeta = 0.0387), and slow Spiral mode (tau = 238.1 s). Evaluated compliance against MIL-F-8785C criteria, showing unaugmented Dutch roll damping falls well below the 0.08 minimum, confirming the need for stability augmentation."
      },
      {
        "title": "Full-System vs. Reduced-Order Approximations",
        "content": "Formulated 2x2 reduced-order approximations for Short-Period (w, q), Phugoid (u, theta), and Dutch Roll (v, r), plus 1st-order models for Rolling and Spiral modes. Simulated responses under a 1-degree angle-of-attack gust disturbance and elevator/rudder step inputs. Short-period approximation tracked the initial 10 seconds of response with high fidelity, while Dutch roll approximation captured frequency accurately but overestimated damping ratio (zeta = 0.0883 vs. 0.0387) due to omitted roll-rate cross-coupling relief."
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
      "/images/projects/flight-dynamics/Fig04_SP_q_Initial.png"
    ]
  },
  {
    "slug": "joukowski-airfoil-aerodynamics",
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
        "content": "Derived closed-form expressions for upper and lower surface tangential velocities Vu(theta) and Vl(theta) as functions of cylinder angle. Computed non-dimensional pressure coefficient distributions Cp = 1 - (V/V_inf)^2. Implemented numerical contour integration along upper and lower surfaces to determine sectional lift coefficient (CL), quarter-chord pitching moment (Cm,c/4), and leading-edge moment (Cm,LE) across an alpha sweep from -5 deg to 10 deg."
      },
      {
        "title": "CFD Benchmark & Aerodynamic Correlation",
        "content": "Created structured 2D computational fluid domains in ANSYS Fluent to model viscous flow past the identical Joukowski geometry. Extracted wall surface pressure profiles, velocity vectors, and streamlines. Compared analytical potential flow predictions against viscous Navier-Stokes CFD results, analyzing boundary layer displacement thickness effects, leading-edge suction peak magnitude, and viscous pressure drag."
      }
    ],
    "links": {},
    "gallery": [
      "/images/projects/joukowski-airfoil/CP.jpg",
      "/images/projects/joukowski-airfoil/AIFOIL.jpg",
      "/images/projects/joukowski-airfoil/V.jpg",
      "/images/projects/joukowski-airfoil/aa.jpg"
    ]
  },
  {
    "slug": "turbulent-pipe-flow-cfd",
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
        "content": "Modeled a circular pipe (diameter D = 1 m, lengths L = 20 m and 30 m) under uniform inlet velocity (1 m/s, Re = 10^6) with 4.8% inlet turbulence intensity. Generated a fine 2D axisymmetric grid with 100 axial divisions and 50 radial divisions, applying a 10.0 bias factor toward the pipe wall to properly resolve the near-wall laminar sublayer (y+ <= 1)."
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
      "/images/projects/turbulent-pipe-flow/wall_shear_stress.png",
      "/images/projects/turbulent-pipe-flow/dissipation_rate.png",
      "/images/projects/turbulent-pipe-flow/flow_developed.png",
      "/images/projects/turbulent-pipe-flow/skin_friction_factor.png",
      "/images/projects/turbulent-pipe-flow/yplus_wall.png"
    ]
  },
  {
    "slug": "cold-gas-rocket-engine",
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
        "content": "Design point: P0,d = 100 bar, T0,d = 2200 K, perfect expansion to ambient. Tank initial: Pt,0 = 200 bar, Tt,0 = 300 K, Vt = 0.5 m^3, working gas: air. Final nozzle sizing: Dt = 20.0 mm, Me = 3.68, Ae/At = 8.05, De = 56.7 mm, Design thrust \u2248 4865 N (\u2248 4.87 kN)."
      }
    ],
    "links": {
      "paper": "/files/gasdynamics_rocketproject.pdf"
    },
    "gallery": [
      "/images/projects/coldgas/Concept layout (Figure 1).png",
      "/images/projects/coldgas/Nozzle geometry (Figure 2).png",
      "/images/projects/coldgas/Rayleigh duct schematic (Figure 3) .png",
      "/images/projects/coldgas/Performance plots (Figures 4.png",
      "/images/projects/coldgas/Performance plots (Figures 5).png"
    ]
  },
  {
    "slug": "ramjet-engine-inlet-optimization",
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
        "content": "Optimized ramp angles to theta1 = 14.5 deg and theta2 = 17.5 deg, achieving intake total-pressure recovery Pt3/Pt0 = 0.8086 (~81%). At the Mach 2.75 design point the engine produced ~6.26 kN net thrust (m_dot = 9.88 kg/s; specific thrust = 633 N/(kg/s)) within the 25x25 cm envelope (At = 0.0562 m^2, Ae = 0.0625 m^2). Off-design analysis showed unstart at Mach 2.0 and strong high-speed potential at Mach 4.0 reaching 13.67 kN maximum net thrust at Tt5 = 2200 K."
      }
    ],
    "links": {
      "paper": "/files/gasdynamics_scramjetProject (1).pdf"
    },
    "gallery": [
      "/images/projects/scramjet/scremjet.png"
    ]
  },
  {
    "slug": "3dof-planar-robotic-arm",
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
    "summary": "Designed, modeled, and built a low-cost 3-DOF planar robotic arm. Derived analytical FK/IK, built a MATLAB  digital twin GUI for interactive control + safety checks, and drove SG90 servos via Arduino; validated performance with LiDAR measurements.",
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
      "/images/projects/robotic-arm/gui.png",
      "/images/projects/robotic-arm/assembled.jpg"
    ]
  },
  {
    "slug": "active-suspension-lqr",
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
    "gallery": [
      "/images/projects/suspension-1.jpg",
      "/images/projects/suspension-2.jpg"
    ]
  },
  {
    "slug": "aquaponic-system-fluid-mechanics",
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
    "summary": "Engineered a closed-loop recirculating aquaponics facility (fish tank, grow beds, biofilter, radial flow clarifier). Derived analytical fluid mechanics models for automatic Bell Siphon cyclical dosing, sized Venturi aeration and flowmeter devices per ASME MFC-3M-2004, and completed 2D CAD engineering drawings and market bill of materials.",
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
        "title": "CAD Drawings & Economic Feasibility",
        "content": "Generated multi-view engineering drawings (Front, Side, Top views) with full piping schematics and produced a comprehensive market procurement analysis totaling \u2248 ."
      }
    ],
    "links": {
      "paper": "/files/ENGR207_Aquaponics_Project_Report.pdf"
    },
    "gallery": [
      "/images/projects/aquaponic-system/aquaponic_system.png",
      "/images/projects/aquaponic-system/viscometer_cad.png",
      "/images/projects/aquaponic-system/viscometer_1.png",
      "/images/projects/aquaponic-system/viscometer_2.png"
    ]
  },
  {
    "slug": "two-stage-gearbox-design",
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
    "summary": "Derived equations of motion for an unstable inverted pendulum Segway vehicle G(s) = -0.1533/(s^2 - 11.841), designed Root Locus pole-placement feedback compensation to achieve target damping zeta = 0.451 and natural frequency omega_n = 21.9 rad/s, and validated stability in Simulink.",
    "sections": [
      {
        "title": "Dynamical Modeling & Open-Loop Instability",
        "content": "Formulated linearized equations of motion for the mobile two-wheeled inverted pendulum cart-pendulum system. Identified the open-loop unstable right-half-plane pole pair at s = +-3.441 rad/s resulting from gravitational destabilization."
      },
      {
        "title": "Root Locus Compensation & Gain Calculation",
        "content": "Plotted root locus in MATLAB and synthesized a feedback compensator placing closed-loop poles at desired locations s0 = -10 +- 19.5j, achieving damping ratio zeta = 0.451 and rapid settling. Computed exact critical gain Ku = 1/|G(s0)| and verified pole stability."
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
        "content": "Sized high-aspect-ratio rectangular wing with polyhedral tip angles to ensure passive roll stability and Dutch roll damping during unguided free flight at low Reynolds numbers (Re < 10^5)."
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
      "/images/projects/glider/glider_prototype.png"
    ]
  }
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
