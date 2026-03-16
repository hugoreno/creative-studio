import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

let cachedFonts: FontData[] | null = null;

const require = createRequire(import.meta.url);

function resolveFontsource(pkg: string, file: string): string {
  const pkgJson = require.resolve(`${pkg}/package.json`);
  return pkgJson.replace("package.json", `files/${file}`);
}

export async function loadFonts(): Promise<FontData[]> {
  if (cachedFonts) return cachedFonts;

  const [interRegular, interBold, playfairBold] = await Promise.all([
    readFile(resolveFontsource("@fontsource/inter", "inter-latin-400-normal.woff")),
    readFile(resolveFontsource("@fontsource/inter", "inter-latin-700-normal.woff")),
    readFile(resolveFontsource("@fontsource/playfair-display", "playfair-display-latin-700-normal.woff")),
  ]);

  cachedFonts = [
    { name: "Inter", data: interRegular.buffer as ArrayBuffer, weight: 400, style: "normal" },
    { name: "Inter", data: interBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
    { name: "Playfair Display", data: playfairBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
  ];

  return cachedFonts;
}
