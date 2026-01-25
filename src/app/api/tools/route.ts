import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-pro"; // or gemini-1.5-flash

export async function POST(request: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json(
            { text: "Server Error: GEMINI_API_KEY not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { tool, inputs, profile } = body;

        let systemPrompt = "You are a helpful career assistant.";
        let userPrompt = "";

        // Construct prompts based on tool
        if (tool === "resume_tailor") {
            systemPrompt =
                "You are an expert resume writer. Format your response in LaTeX code suitable for a resume.";
            userPrompt = `
        Refine the resume content based on:
        Role: ${inputs.roleTitle}
        Job Description: ${inputs.jobDescription}
        Refine the Resume for: ${inputs.instruction}

        Profile: ${JSON.stringify(profile)}
      `;
        } else if (tool === "job_fit") {
            systemPrompt = "You are a career consultant.";
            userPrompt = `
        Analyze job fit:
        Job Description: ${inputs.jobDescription}
        Instruction: ${inputs.instruction}
        
        Profile: ${JSON.stringify(profile)}
      `;
        } else if (tool === "acceptance") {
            systemPrompt = "You are a career analyst.";
            userPrompt = `
        Estimate acceptance likelihood:
        Company Type: ${inputs.companyType}
        Job Description: ${inputs.jobDescription}
        Instruction: ${inputs.instruction}
        
        Profile: ${JSON.stringify(profile)}
      `;
        } else if (tool === "cover_letter") {
            systemPrompt =
                "You are an expert cover letter writer. Format the cover letter part in valid LaTeX code.";
            userPrompt = `
        Write a cover letter:
        Company: ${inputs.companyName}
        Role: ${inputs.roleTitle}
        Tone: ${inputs.tone}
        Job Description: ${inputs.jobDescription}
        Instruction: ${inputs.instruction}
        
        Profile: ${JSON.stringify(profile)}
      `;
        } else {
            return NextResponse.json({ text: "Unknown tool" }, { status: 400 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `${systemPrompt}\n\n${userPrompt}`
                            }
                        ]
                    }
                ]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to generate response from Gemini");
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error("Invalid response format from Gemini");
        }

        return NextResponse.json({
            text: generatedText,
        });
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { text: `Error generating response: ${error.message}` },
            { status: 500 }
        );
    }
}
