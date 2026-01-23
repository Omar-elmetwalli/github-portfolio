import Link from "next/link";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";

export default function Home() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Hello, I&apos;m
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
              {profile.title}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              {profile.summary}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                View Projects
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.skills.map((skill) => (
              <div
                key={skill}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.summary}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  {project.date}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Interested in working together?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            I&apos;m always open to discussing new projects, opportunities, or collaborations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Let&apos;s Connect
          </Link>
        </div>
      </section>
    </div>
  );
}
