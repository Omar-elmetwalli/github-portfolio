"use client";

import { useState } from "react";
import { profile } from "../../../data/profile";
import { projects } from "../../../data/projects";
import { callAi } from "../../lib/callAi";

interface PromptCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  prompt: string;
  disclaimer?: string;
  output?: string | null;
  onGenerate?: () => Promise<void>;
  generating?: boolean;
}

function PromptCard({
  title,
  description,
  children,
  prompt,
  disclaimer,
  output,
  onGenerate,
  generating,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output ?? prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      {disclaimer && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            ⚠️ {disclaimer}
          </p>
        </div>
      )}
      {children}
      <div className="mt-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-48 overflow-y-auto">
          <textarea
            readOnly
            value={output ?? prompt}
            className="w-full h-40 bg-transparent text-sm text-gray-700 dark:text-gray-300 font-mono resize-none outline-none"
          />
        </div>

        <div className="flex gap-3 mt-3">
          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={generating}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                generating ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {generating ? "Generating..." : "Generate with AI"}
            </button>
          )}

          <button
            onClick={copyToClipboard}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              copied ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------- ResumeTailorPrompt (example) ------- */
function ResumeTailorPrompt() {
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const prompt = `You are a professional resume writer. Help me tailor my resume for the following position.

MY BACKGROUND:
Name: ${profile.name}
Current Title: ${profile.title}
Summary: ${profile.summary}
Skills: ${profile.skills.join(", ")}

PROJECTS:
${projects.map((p) => `- ${p.title}: ${p.summary}`).join("\n")}

TARGET ROLE: ${roleTitle || "[Enter role title]"}

JOB DESCRIPTION:
${jobDescription || "[Paste job description here]"}

Please:
1. Provide tailored resume bullets (use strong action verbs, quantifiable outcomes where possible).
2. Provide 8-12 keyword suggestions to include in the resume for ATS.
`;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const text = await callAi({
        tool: "resume_tailor",
        inputs: { roleTitle, jobDescription },
        profile: {
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          skills: profile.skills,
        },
      });
      setOutput(text);
    } catch (err: any) {
      setOutput(`Error: ${err.message || "Failed to generate. Try again later."}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PromptCard
      title="Resume Tailor Prompt"
      description="Generate a prompt to help tailor your resume for a specific role."
      prompt={prompt}
      output={output}
      onGenerate={handleGenerate}
      generating={generating}
    >
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Role Title (e.g., CFD Engineer)"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
        />
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 resize-none"
        />
      </div>
    </PromptCard>
  );
}

/* ------- JobFitCheckerPrompt ------- */
function JobFitCheckerPrompt() {
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const prompt = `Analyze how well my profile matches this job opportunity.

MY PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Summary: ${profile.summary}
Skills: ${profile.skills.join(", ")}

MY PROJECTS:
${projects.map((p) => `- ${p.title} (${p.tags.join(", ")}): ${p.summary}`).join("\n")}

JOB DESCRIPTION:
${jobDescription || "[Paste job description here]"}

Please provide:
1. Match Score (0-100%) with explanation
2. Matching Skills & Experience (what aligns well)
3. Gaps & Missing Requirements (what I'm lacking)
4. Transferable Skills (how my experience applies)
5. Recommendations (how to strengthen my application)
6. Keywords to emphasize
7. Next steps
`;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const text = await callAi({
        tool: "job_fit",
        inputs: { jobDescription },
        profile: {
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          skills: profile.skills,
        },
      });
      setOutput(text);
    } catch (err: any) {
      setOutput(`Error: ${err.message || "Failed to generate. Try again later."}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PromptCard
      title="Job Fit Checker Prompt"
      description="Analyze how well your profile matches a job opportunity."
      prompt={prompt}
      output={output}
      onGenerate={handleGenerate}
      generating={generating}
    >
      <div className="space-y-3">
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 resize-none"
        />
      </div>
    </PromptCard>
  );
}

/* ------- AcceptanceLikelihoodPrompt ------- */
function AcceptanceLikelihoodPrompt() {
  const [companyType, setCompanyType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const prompt = `Estimate my likelihood of getting this position based on my profile.

MY PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Summary: ${profile.summary}
Skills: ${profile.skills.join(", ")}

MY PROJECTS:
${projects.map((p) => `- ${p.title}: ${p.summary} | Tools: ${p.tools.join(", ")}`).join("\n")}

COMPANY TYPE: ${companyType || "[Enter company type, e.g., Startup, Fortune 500, Research Lab]"}

JOB DESCRIPTION:
${jobDescription || "[Paste job description here]"}

Please analyze:
1. Estimated Acceptance Likelihood (Low/Medium/High) with reasoning
2. Strongest Qualifications
3. Weakest Areas
4. Competition Level
5. Suggestions to Improve Chances

Include a disclaimer: "Estimate only, not a guarantee."`;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const text = await callAi({
        tool: "acceptance",
        inputs: { companyType, jobDescription },
        profile: {
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          skills: profile.skills,
        },
      });
      setOutput(text);
    } catch (err: any) {
      setOutput(`Error: ${err.message || "Failed to generate. Try again later."}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PromptCard
      title="Acceptance Likelihood Prompt"
      description="Get an estimate of your chances for a specific position."
      prompt={prompt}
      disclaimer="Estimate only. Not a guarantee."
      output={output}
      onGenerate={handleGenerate}
      generating={generating}
    >
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Company Type (e.g., Aerospace Startup, Defense Contractor)"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
        />
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 resize-none"
        />
      </div>
    </PromptCard>
  );
}

/* ------- CoverLetterPrompt ------- */
function CoverLetterPrompt() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("professional");
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const prompt = `Write a cover letter and LinkedIn connection message for this opportunity.

MY PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Email: ${profile.email}
LinkedIn: ${profile.linkedin}
Summary: ${profile.summary}

KEY PROJECTS:
${projects.slice(0, 3).map((p) => `- ${p.title}: ${p.summary}`).join("\n")}

TARGET:
Company: ${company || "[Enter company name]"}
Role: ${role || "[Enter role title]"}
Tone: ${tone}

Please generate:

1. COVER LETTER (${tone} tone) — 1 page max
2. LINKEDIN CONNECTION MESSAGE — short (under 300 chars)
`;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const text = await callAi({
        tool: "cover_letter",
        inputs: { company, role, tone },
        profile: {
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          skills: profile.skills,
        },
      });
      setOutput(text);
    } catch (err: any) {
      setOutput(`Error: ${err.message || "Failed to generate. Try again later."}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PromptCard
      title="Cover Letter & LinkedIn Message"
      description="Generate personalized outreach content for job applications."
      prompt={prompt}
      output={output}
      onGenerate={handleGenerate}
      generating={generating}
    >
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Role Title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
        />
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
        >
          <option value="professional">Professional</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="conversational">Conversational</option>
          <option value="formal">Formal</option>
        </select>
      </div>
    </PromptCard>
  );
}

/* ------- ToolsPage (uses the cards) ------- */
export default function ToolsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Career Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            AI-powered prompt generators to help with your job search. Copy these prompts and use them with your favorite AI assistant — or generate outputs directly.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Free Mode:</strong> These tools generate prompts personalized with your profile data. Use "Generate with AI" to call your deployed API.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <ResumeTailorPrompt />
          <JobFitCheckerPrompt />
          <AcceptanceLikelihoodPrompt />
          <CoverLetterPrompt />
        </div>
      </div>
    </div>
  );
}


