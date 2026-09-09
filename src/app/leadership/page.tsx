import Link from "next/link";
import { leadershipRoles } from "../../../data/leadership";
import { profile } from "../../../data/profile";

export const metadata = {
  title: `Leadership | ${profile.name}`,
  description: "Leadership roles, student organizations, and aerospace community initiatives by Omar Elmetwalli.",
};

export default function LeadershipPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Community & Extracurricular Impact
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Leadership & Initiatives
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Empowering aspiring aerospace engineers, establishing international student chapters, and organizing hands-on technical workshops at Zewail City of Science and Technology.
          </p>
        </div>

        {/* Roles List */}
        <div className="space-y-12">
          {leadershipRoles.map((role) => (
            <section
              key={role.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                      {role.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {role.period}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {role.title}
                  </h2>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mt-1">
                    {role.organization}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {role.location}
                  </p>
                </div>

                {role.links && (
                  <div className="flex flex-wrap gap-3">
                    {role.links.website && (
                      <a
                        href={role.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        AIAA Official Site
                      </a>
                    )}
                    {role.links.linkedin && (
                      <a
                        href={role.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="my-6">
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  {role.summary}
                </p>
              </div>

              {/* Grid: Responsibilities & Initiatives */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {role.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Key Initiatives & Workshops
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {role.initiatives.map((init, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                        <span>{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Achievements */}
              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 my-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Milestones & Achievements
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {role.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold mt-0.5">+</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {role.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Dynamic User Contribution Callout */}
        <div className="mt-12 p-8 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 text-center">
          <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready for More Leadership Content
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-4">
            This section is structured and ready for additional AIAA Zewail City materials, photos, event highlights, executive board members, or announcements whenever you want to provide them!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
