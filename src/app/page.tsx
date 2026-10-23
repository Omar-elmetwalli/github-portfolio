import Link from "next/link";
import { profile } from "../../data/profile";
import { resume } from "../../data/resume";
import StreamlineCanvas from "@/components/StreamlineCanvas";
import StatsCounter from "@/components/StatsCounter";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import LeadershipSpotlight from "@/components/LeadershipSpotlight";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/github-portfolio" : "";
  const prefixPath = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

  return (
    <div className="relative min-h-screen aerospace-grid">
      {/* ========================================================
          1. HERO SECTION (#home)
         ======================================================== */}
      <section
        id="home"
        className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 overflow-hidden"
      >
        {/* Interactive Aerodynamic Particle Canvas Background */}
        <StreamlineCanvas />

        {/* Ambient radial blur glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 to-cyan-400/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scientific ML & CFD Researcher • Founder & Chair, AIAA Zewail City</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-950 dark:text-white tracking-tight leading-none">
              Hi, I&apos;m{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500">
                {profile.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Aerospace Engineering student specializing in{" "}
              <span className="text-blue-600 dark:text-cyan-400 font-bold">
                Physics-Informed Neural Networks (PINNs)
              </span>
              , multiscale turbulence modeling, high-fidelity CFD, and experimental PIV diagnostics.
            </p>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Co-authoring research on ML-augmented turbulence with UT Dallas & Stevens Institute, investigating Keller–Segel PDE dynamics with Univ at Buffalo, incoming RA at AUC, and Founder & Chair of Egypt&apos;s first AIAA Student Branch.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#projects"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Explore Projects</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            <a
              href="#leadership"
              className="px-6 py-3.5 rounded-xl glass-panel text-gray-900 dark:text-white font-bold text-sm hover:border-blue-500/50 transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>AIAA Leadership</span>
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </a>

            <a
              href={prefixPath(resume.pdfPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Download CV (PDF)
            </a>

            <a
              href="#contact"
              className="px-5 py-3.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Get in Touch →
            </a>
          </div>

          {/* Animated Stats Metric Cards */}
          <StatsCounter />
        </div>
      </section>

      {/* ========================================================
          2. ABOUT & RESEARCH AFFILIATIONS (#about)
         ======================================================== */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Background & Research Trajectory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
              About Me & Academic Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Bio story */}
            <div className="lg:col-span-7 space-y-6 text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              <p>
                I am an aerospace engineering researcher at the intersection of <strong>computational fluid dynamics</strong> and <strong>scientific machine learning</strong>. My research investigates how physical conservation laws, vorticity dynamics, and Navier–Stokes residuals can constrain deep neural operators and PINNs to achieve physically consistent, lightning-fast aerodynamic predictions.
              </p>
              <p>
                Alongside theoretical and numerical modeling, I have hands-on experimental experience with <strong>Particle Image Velocimetry (PIV)</strong> diagnostics for high-resolution flow measurement, as well as industrial R&D in turbomachinery suction devices (patent-pending).
              </p>

              {/* Research Affiliations Grid */}
              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Current Research Collaborations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white block">UT Dallas & Stevens Institute</span>
                    <span className="text-gray-500 dark:text-gray-400">Physics-informed 3D U-Nets & turbulence datasets</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white block">University at Buffalo</span>
                    <span className="text-gray-500 dark:text-gray-400">Biological Keller–Segel PDE gradient dynamics</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white block">American University in Cairo (AUC)</span>
                    <span className="text-gray-500 dark:text-gray-400">PIV experimental flow diagnostics & topology optimization</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white block">AIAA Student Branch</span>
                    <span className="text-gray-500 dark:text-gray-400">Founder & Chair, Egypt&apos;s first AIAA branch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-cyan-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    Academic Degree
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                    B.Sc. Aerospace Engineering
                  </h3>
                </div>
              </div>

              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Minor in Communications & Information Engineering
              </div>
              <div className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                University of Science and Technology (Zewail City)
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Giza, Egypt • 2022 — Expected Jun 2027
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                <strong>Cumulative GPA: 3.303 / 4.00</strong> (Top 10 Individual Rank in Class)
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Key Coursework
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fluid Mechanics, Gas Dynamics, Aerodynamics, Heat Transfer, PDEs/ODEs, Numerical Analysis, Classical Control, Continuum Mechanics, Machine Design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SKILLS & COMPETENCIES (#skills)
         ======================================================== */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Technical Tooling & Methodologies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
              Core Competencies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cluster 1: Scientific ML */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold text-lg">
                🧠
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Scientific Machine Learning & PINNs
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Physics-Informed Neural Networks, Fourier Feature Embeddings, 3D U-Nets, Neural Operators (FNO), JHTDB datasets, Navier-Stokes loss enforcement, Kriging/GPR surrogates.
              </p>
            </div>

            {/* Cluster 2: CFD */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                💨
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Computational Fluid Dynamics
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                OpenFOAM v2306 (simpleFoam, blockMesh), ANSYS Fluent, RANS turbulence models (Spalart-Allmaras, SST k-ω), structured 5-block C-grids ($y^+ \approx 1$), boundary layer resolution.
              </p>
            </div>

            {/* Cluster 3: Diagnostics */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-lg">
                🔬
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Experimental Flow Diagnostics
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Particle Image Velocimetry (PIV), optical laser diagnostics, experimental flow field reconstruction, camera calibration, topology optimization for thermal convection.
              </p>
            </div>

            {/* Cluster 4: Flight Dynamics */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                ✈️
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Flight Dynamics & Control
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                6-DOF state-space longitudinal & lateral equations of motion, modal analysis (short-period, phugoid, Dutch roll), classical autopilot synthesis (PID/PI), MIL-F-8785C compliance.
              </p>
            </div>

            {/* Cluster 5: Mechanical & CAD */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
                ⚙️
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                CAD, CAM & Turbomachinery
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Certified SolidWorks Associate (CSWA), Autodesk Inventor, 2-stage spur gearboxes, shafts, turbomachinery suction devices (patent-pending), manufacturing drawing GD&T.
              </p>
            </div>

            {/* Cluster 6: Scientific Programming */}
            <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-lg">
                💻
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Scientific Computing
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Python (PyTorch, NumPy, SciPy, Matplotlib), C++, MATLAB / Simulink, Linux / Bash scripting, OpenFOAM dictionary automation, Git / GitHub version control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. PROJECTS SHOWCASE & EXPLORER (#projects)
         ======================================================== */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Portfolio of Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
                Engineering & Research Projects
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Filter by engineering domain or click any project card to open its technical methodology, downloadable PDF papers, and simulation media.
            </p>
          </div>

          <ProjectsExplorer />
        </div>
      </section>

      {/* ========================================================
          5. AIAA LEADERSHIP SPOTLIGHT (#leadership)
         ======================================================== */}
      <section id="leadership" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Extracurricular & Regional Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
              AIAA Student Branch Leadership
            </h2>
          </div>

          <LeadershipSpotlight />
        </div>
      </section>

      {/* ========================================================
          6. EXPERIENCE & RESEARCH TIMELINE (#experience)
         ======================================================== */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Career Trajectory & Appointments
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
              Research & Engineering Experience
            </h2>
          </div>

          <ExperienceTimeline />
        </div>
      </section>

      {/* ========================================================
          7. CONTACT & COLLABORATION (#contact)
         ======================================================== */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Initiate Discussion
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white">
              Get in Touch
            </h2>
          </div>

          <ContactSection />
        </div>
      </section>
    </div>
  );
}
