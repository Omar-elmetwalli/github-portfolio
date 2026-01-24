const OpenAI = require("openai");

// Vercel serverless function handler
module.exports = async (req, res) => {
  // CORS headers (allow only your GitHub Pages origin)
  res.setHeader("Access-Control-Allow-Origin", "https://omar-elmetwali.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = req.body;
  if (!body) {
    // try to parse raw body
    try {
      const raw = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
      });
      body = raw ? JSON.parse(raw) : {};
    } catch (err) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }
  }

  const { tool, inputs = {}, profile = {} } = body || {};
  if (!tool) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing 'tool' in request body" }));
    return;
  }

  const devInstructions = {
    resume_tailor:
      "Produce tailored resume bullet points for the candidate and provide 8-12 ATS keyword suggestions. Output plain text with bullets and a Keywords: line.",
    job_fit:
      "Evaluate the candidate against the job description and return: Match Score (0-100), Strengths, Gaps, Keywords, and Next steps. Output plain text with clear labeled sections.",
    acceptance:
      "Estimate acceptance likelihood and provide a brief score and reasons. Include the disclaimer: 'Estimate only, not a guarantee.' Output plain text with labeled sections.",
    cover_letter:
      "Write a 1-page cover letter tailored to the company/role and include a short LinkedIn connection message (under 300 chars). Output plain text with the cover letter first and the LinkedIn message separated clearly.",
  };

  const instruction = devInstructions[tool];
  if (!instruction) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: `Unsupported tool: ${tool}` }));
    return;
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server misconfiguration: missing OPENAI_API_KEY" }));
    return;
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4.1";

  const prompt = `${instruction}\n\nUSER INPUTS:\n${JSON.stringify(inputs, null, 2)}\n\nPROFILE:\n${JSON.stringify(profile, null, 2)}\n\nRespond in plain text only.`;

  try {
    const response = await client.responses.create({
      model,
      input: prompt,
    });

    // Prefer output_text if available
    let text = response.output_text || null;

    // Otherwise build text from response.output[].content
    if (!text && Array.isArray(response.output) && response.output.length) {
      text = response.output
        .map((out) => {
          if (out.content && Array.isArray(out.content)) {
            return out.content.map((c) => c.text || (typeof c === "string" ? c : "")).join("");
          }
          return out.text || "";
        })
        .join("\n");
    }

    // Last fallback: stringify a small part of the response
    if (!text) text = JSON.stringify(response, null, 2);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ text }));
  } catch (err) {
    const message = err?.message || String(err) || "Unknown error";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: message }));
  }
};
