import katex from "katex";
import { splitMath } from "@/lib/math";

/**
 * Renders text with inline $...$ math as KaTeX HTML at build time (server
 * component, so no KaTeX JavaScript reaches the browser). Pages using it must
 * import "katex/dist/katex.min.css".
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
              __html: katex.renderToString(part.value, { throwOnError: false, output: "htmlAndMathml" }),
            }}
          />
        )
      )}
    </>
  );
}
