import { Resvg } from "@resvg/resvg-js";
import type { CreativeBrief } from "../lib/types";
import { renderToSvg } from "./satori-render";

export async function renderToPng(brief: CreativeBrief): Promise<Buffer> {
  const svg = await renderToSvg(brief);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "original" },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}
