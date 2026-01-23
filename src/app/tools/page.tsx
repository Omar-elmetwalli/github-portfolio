"use client";

import { useState } from "react";
import { profile } from "../../../data/profile";
import { projects } from "../../../data/projects";

interface PromptCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  prompt: string;
  disclaimer?: string;
}

function PromptCard({ title, description, children, prompt, disclaimer }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
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
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {prompt}
          </pre>
        </div>
        <button
          onClick={copyToClipboard}
          className={`mt-3 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy Prompt"}
        </button>
      </div>
    </div>
  );
}

function ResumeTailorPrompt() {
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

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
1. Identify the key skills and requirements from the job description
2. Suggest how to reframe my experience to match these requirements
3. Recommend which projects to highlight and how to describe them
4. Provide specific bullet points I can use in my resume
5. Suggest any skills gaps I should address`;

  return (
    <PromptCard
      title="Resume Tailor Prompt"
      description="Generate a prompt to help tailor your resume for a specific role."
      prompt={prompt}
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

function JobFitCheckerPrompt() {
  const [jobDescription, setJobDescription] = useState("");

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
6. Red Flags (any concerns a recruiter might have)`;

  return (
    <PromptCard
      title="Job Fit Checker Prompt"
      description="Analyze how well your profile matches a job opportunity."
      prompt={prompt}
    >
      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 resize-none"
      />
    </PromptCard>
  );
}

function AcceptanceLikelihoodPrompt() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyType, setCompanyType] = useState("");

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
2. Strongest Qualifications (what makes me competitive)
3. Weakest Areas (what might hold me back)
4. Competition Level (typical candidate pool for this role)
5. Suggestions to Improve Chances
6. Alternative Roles (if this is a stretch, what similar roles might be better fits)`;

  return (
    <PromptCard
      title="Acceptance Likelihood Prompt"
      description="Get an estimate of your chances for a specific position."
      prompt={prompt}
      disclaimer="Estimate only. Not a guarantee."
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

function CoverLetterPrompt() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("professional");

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

1. COVER LETTER (${tone} tone)
- Opening paragraph that hooks the reader
- 2-3 body paragraphs highlighting relevant experience
- Closing paragraph with call to action
- Keep it under 400 words

2. LINKEDIN CONNECTION MESSAGE
- Brief, personalized message (under 300 characters)
- Reference something specific about the company/role
- Clear but not pushy call to action

3. LINKEDIN INMAIL (if no mutual connection)
- Slightly longer version (under 200 words)
- More context about my background
- Specific value I can bring`;

  return (
    <PromptCard
      title="Cover Letter & LinkedIn Message"
      description="Generate personalized outreach content for job applications."
      prompt={prompt}
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

function ProjectPagePrompt() {
  const [projectNotes, setProjectNotes] = useState("");

  const prompt = `Transform my project notes into a structured portfolio write-up.

AUTHOR CONTEXT:
Name: ${profile.name}
Background: ${profile.title}
Writing Style: Technical but accessible, focused on engineering process and results

PROJECT NOTES:
${projectNotes || "[Paste your rough project notes here]"}

Please generate a structured project write-up with:

1. TITLE
- Clear, descriptive title that captures the essence

2. SUMMARY (2-3 sentences)
- What the project is and its main achievement

3. TAGS
- Suggest 3-5 relevant tags (e.g., CFD, Propulsion, Controls)

4. TOOLS & TECHNOLOGIES
- List all tools, software, and technologies used

5. SECTIONS:
   a) Problem Statement
      - What challenge was being addressed
      - Why it matters
   
   b) Approach
      - Methodology and technical approach
      - Key decisions and trade-offs
   
   c) Results
      - Quantitative outcomes where possible
      - Key achievements and metrics
   
   d) What I Learned
      - Technical insights gained
      - Skills developed

6. SUGGESTED LINKS
- What documentation/code/demos could be linked

Format the output so it can be easily copied into a portfolio data file.`;

  return (
    <PromptCard
      title="Project Page Generator"
      description="Transform rough notes into a structured project write-up."
      prompt={prompt}
    >
      <textarea
        placeholder="Paste your rough project notes, bullet points, or description here..."
        value={projectNotes}
        onChange={(e) => setProjectNotes(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 resize-none"
      />
    </PromptCard>
  );
}

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
            AI-powered prompt generators to help with your job search. Copy these prompts and use them with your favorite AI assistant.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Free Mode:</strong> These tools generate prompts personalized with your profile data. Copy the prompt and paste it into ChatGPT, Claude, or any AI assistant.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <ResumeTailorPrompt />
          <JobFitCheckerPrompt />
          <AcceptanceLikelihoodPrompt />
          <CoverLetterPrompt />
          <ProjectPagePrompt />
        </div>
      </div>
    </div>
  );
}
