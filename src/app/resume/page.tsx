import { profile } from "../../../data/profile";
import { resume } from "../../../data/resume";
import ResumeDownloadButton from "./ResumeDownloadButton";

export const metadata = {
  title: `Resume | ${profile.name}`,
  description: `Professional resume of ${profile.name} - ${profile.title}`,
};

export default function ResumePage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Resume
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {profile.name} • {profile.title.split("•")[0].trim()}
            </p>
          </div>
          <ResumeDownloadButton pdfPath={resume.pdfPath} />
        </div>

        {/* Contact Info */}
        <section className="mb-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {exp.period}
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {exp.company}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {exp.location}
                </p>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Education
          </h2>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {edu.period}
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {edu.institution}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {edu.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Simulation</h3>
              <div className="flex flex-wrap gap-2">
                {resume.technicalSkills.simulation.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">CAD</h3>
              <div className="flex flex-wrap gap-2">
                {resume.technicalSkills.cad.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Programming</h3>
              <div className="flex flex-wrap gap-2">
                {resume.technicalSkills.programming.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Other</h3>
              <div className="flex flex-wrap gap-2">
                {resume.technicalSkills.other.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {resume.certifications.map((cert, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {resume.languages.map((lang, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-900 dark:text-white">{lang.name}</span>
                <span className="text-gray-500 dark:text-gray-500"> — {lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
