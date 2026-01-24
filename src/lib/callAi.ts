export type ToolId = "resume_tailor" | "job_fit" | "acceptance" | "cover_letter";

export async function callAi(
  endpoint: string | undefined, // Allow undefined to default
  tool: ToolId,
  inputs: Record<string, any>,
  profile: any
): Promise<string> {
  // Default to internal API if no endpoint provided
  const targetEndpoint = endpoint || "/api/tools";

  const response = await fetch(targetEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool,
      inputs,
      profile,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    // Try to parse JSON error if possible
    try {
      const jsonErr = JSON.parse(err);
      if (jsonErr.text) throw new Error(jsonErr.text);
    } catch (e) {
      // ignore
    }
    throw new Error(`API error: ${response.statusText} (${err})`);
  }

  const data = await response.json();
  if (data && typeof data.text === "string") {
    return data.text;
  }
  throw new Error("Invalid response format");
}
