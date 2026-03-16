import satori from "satori";
import React from "react";
import { tokens } from "../lib/tokens";
import type { CreativeBrief } from "../lib/schemas";
import { getTemplate } from "../templates/index";
import { loadFonts } from "../fonts/load-fonts";

export async function renderToSvg(brief: CreativeBrief): Promise<string> {
  const Template = getTemplate(brief.template);
  const dimensions = tokens.sizes.ad[brief.size];
  const fonts = await loadFonts();

  const element = React.createElement(Template, { brief });

  const svg = await satori(element, {
    width: dimensions.width,
    height: dimensions.height,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      style: f.style,
    })),
  });

  return svg;
}
