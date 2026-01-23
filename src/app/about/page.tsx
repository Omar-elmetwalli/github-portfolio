import { profile } from "../../../data/profile";

export const metadata = {
  title: `About | ${profile.name}`,
  description: profile.summary,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {profile.title}
          </p>
        </div>

        {/* Summary */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.summary}
          </p>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Education
          </h2>
          <div className="space-y-6">
            {profile.education.map((edu, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {edu.institution}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {edu.location} • {edu.period}
                </p>
                {edu.details && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Interests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.interests.map((interest) => (
              <div
                key={interest}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center"
              >
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {interest}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a
                href={`mailto:${profile.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
