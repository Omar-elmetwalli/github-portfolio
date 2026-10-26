import { buildKnowledge } from "@/lib/knowledge";

// Exported at build time as /ai/knowledge.json. The AI worker fetches it and
// retrieves from it; it contains only content that is already public on the site.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildKnowledge());
}
