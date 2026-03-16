import { NextRequest, NextResponse } from "next/server";
import { CreativeBriefSchema } from "@bordo/ad-insights";
import { renderToPng } from "../../../src/renderer/png-render";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brief = CreativeBriefSchema.parse(body);
    const png = await renderToPng(brief);

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${brief.id}.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Render failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
