import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { text: "Server Error: OPENAI_API_KEY not configured" },
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

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "gpt-4", // or gpt-3.5-turbo
        });

        return NextResponse.json({
            text: completion.choices[0].message.content,
        });
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { text: `Error generating response: ${error.message}` },
            { status: 500 }
        );
    }
}
