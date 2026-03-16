import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

let cachedFonts: FontData[] | null = null;

function fontPath(pkg: string, file: string): string {
  return join(process.cwd(), "node_modules", pkg, "files", file);
}

export async function loadFonts(): Promise<FontData[]> {
  if (cachedFonts) return cachedFonts;

  const [interRegular, interBold, playfairBold] = await Promise.all([
    readFile(fontPath("@fontsource/inter", "inter-latin-400-normal.woff")),
    readFile(fontPath("@fontsource/inter", "inter-latin-700-normal.woff")),
    readFile(fontPath("@fontsource/playfair-display", "playfair-display-latin-700-normal.woff")),
  ]);

  cachedFonts = [
    { name: "Inter", data: interRegular.buffer as ArrayBuffer, weight: 400, style: "normal" },
    { name: "Inter", data: interBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
    { name: "Playfair Display", data: playfairBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
  ];

  return cachedFonts;
}
