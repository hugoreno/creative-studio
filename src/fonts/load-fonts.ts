import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

let cachedFonts: FontData[] | null = null;

function fontPath(file: string): string {
  return join(process.cwd(), "public", "fonts", file);
}

export async function loadFonts(): Promise<FontData[]> {
  if (cachedFonts) return cachedFonts;

  const [interRegular, interBold, playfairBold] = await Promise.all([
    readFile(fontPath("inter-latin-400-normal.woff")),
    readFile(fontPath("inter-latin-700-normal.woff")),
    readFile(fontPath("playfair-display-latin-700-normal.woff")),
  ]);

  cachedFonts = [
    { name: "Inter", data: interRegular.buffer.slice(interRegular.byteOffset, interRegular.byteOffset + interRegular.byteLength), weight: 400, style: "normal" },
    { name: "Inter", data: interBold.buffer.slice(interBold.byteOffset, interBold.byteOffset + interBold.byteLength), weight: 700, style: "normal" },
    { name: "Playfair Display", data: playfairBold.buffer.slice(playfairBold.byteOffset, playfairBold.byteOffset + playfairBold.byteLength), weight: 700, style: "normal" },
  ];

  return cachedFonts;
}
