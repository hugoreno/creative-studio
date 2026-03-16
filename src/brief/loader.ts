import { readFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { CreativeBriefSchema } from "@bordo/ad-insights";
import type { CreativeBrief } from "@bordo/ad-insights";

export async function loadBrief(filePath: string): Promise<CreativeBrief> {
  const raw = await readFile(filePath, "utf-8");
  const json = JSON.parse(raw);
  return CreativeBriefSchema.parse(json);
}

export async function loadBriefsFromDir(dirPath: string): Promise<CreativeBrief[]> {
  const entries = await readdir(dirPath);
  const jsonFiles = entries.filter((f) => extname(f) === ".json");

  const briefs: CreativeBrief[] = [];
  for (const file of jsonFiles) {
    const brief = await loadBrief(join(dirPath, file));
    briefs.push(brief);
  }

  return briefs;
}
