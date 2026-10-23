"use client";

import { useState } from "react";
import { profile } from "../../data/profile";

export default function ContactSection() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sentNotice, setSentNotice] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      formData.subject || `Collaboration inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Contact Info & Quick Copy Pills */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-gray-200 dark:border-cyan-500/20">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Let&apos;s Connect & Collaborate
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Open to research collaborations, computational fluid dynamics & scientific machine learning projects, graduate research discussions, and aerospace engineering opportunities.
            </p>
          </div>

          <div className="space-y-3">
            {/* Email Card with Copy button */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3 group">
              <div className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Academic & Primary Email
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate block">
                  {profile.email}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(profile.email, "email")}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0 cursor-pointer shadow-sm"
              >
                {copiedType === "email" ? "Copied! ✓" : "Copy"}
              </button>
            </div>

            {/* Phone Card with Copy button */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3 group">
              <div className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Phone / WhatsApp
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate block">
                  {profile.phone}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(profile.phone, "phone")}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-shrink-0 cursor-pointer"
              >
                {copiedType === "phone" ? "Copied! ✓" : "Copy"}
              </button>
            </div>

            {/* Location */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Affiliation Base
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Zewail City of Science and Technology, Giza, Egypt
                </span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0A66C2] text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              LinkedIn Profile
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              GitHub Code
            </a>
          </div>
        </div>
      </div>

      {/* Right: Instant Interactive Contact Form */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-cyan-500/20 space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Send a Direct Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Jane Doe / Eng. John"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="colleague@institution.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Subject / Topic
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Research collaboration on CFD / Scientific Machine Learning"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message or project inquiry here..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>Dispatch Message</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {sentNotice && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                Opening your email client...
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
