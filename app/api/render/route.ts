import { ImageResponse } from "next/og";
import React from "react";
import { CreativeBriefSchema } from "../../../src/lib/schemas";
import { tokens } from "../../../src/lib/tokens";
import { getTemplate } from "../../../src/templates/index";

export const runtime = "edge";

// Resolve font URLs at build time (webpack bundles them into the edge function).
// We store the URLs, not the fetch promises, so fonts can be re-read on every request.
const interRegularUrl = new URL("../../../public/fonts/inter-latin-400-normal.woff", import.meta.url);
const interBoldUrl = new URL("../../../public/fonts/inter-latin-700-normal.woff", import.meta.url);
const playfairBoldUrl = new URL("../../../public/fonts/playfair-display-latin-700-normal.woff", import.meta.url);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brief = CreativeBriefSchema.parse(body);

    const Template = getTemplate(brief.template);
    const dimensions = tokens.sizes.ad[brief.size];

    const [interRegular, interBold, playfairBold] = await Promise.all([
      fetch(interRegularUrl).then((r) => r.arrayBuffer()),
      fetch(interBoldUrl).then((r) => r.arrayBuffer()),
      fetch(playfairBoldUrl).then((r) => r.arrayBuffer()),
    ]);

    const element = React.createElement(Template, { brief });

    return new ImageResponse(element, {
      width: dimensions.width,
      height: dimensions.height,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
        { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
        { name: "Playfair Display", data: playfairBold, weight: 700 as const, style: "normal" as const },
      ],
    });
  } catch (err) {
    console.error("Render error:", err);
    const message = err instanceof Error ? err.message : "Render failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
