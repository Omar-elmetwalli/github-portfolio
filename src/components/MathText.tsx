import katex from "katex";
import { splitMath } from "@/lib/math";

/**
 * Renders text with inline $...$ math as MathML at build time (server
 * component, so no KaTeX JavaScript, CSS, or fonts reach the browser).
 * All current browsers render MathML natively.
 */
export default function MathText({ text }: { text: string }) {
  return (
    <>
      {splitMath(text).map((part, i) =>
        part.type === "text" ? (
          part.value
        ) : (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.value, { throwOnError: false, output: "mathml" }),
            }}
          />
        )
      )}
    </>
  );
}
