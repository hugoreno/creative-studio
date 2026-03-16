import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { CreativeBrief } from "../lib/types";
import { renderToPng } from "./png-render";

export interface BatchResult {
  briefId: string;
  outputPath: string;
  success: boolean;
  error?: string;
}

export async function renderBatch(
  briefs: CreativeBrief[],
  outputDir: string
): Promise<BatchResult[]> {
  await mkdir(outputDir, { recursive: true });

  const results: BatchResult[] = [];

  for (const brief of briefs) {
    const outputPath = join(outputDir, `${brief.id}.png`);
    try {
      const png = await renderToPng(brief);
      await writeFile(outputPath, png);
      results.push({ briefId: brief.id, outputPath, success: true });
      console.log(`  ✓ ${brief.id} → ${outputPath}`);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      results.push({ briefId: brief.id, outputPath, success: false, error });
      console.error(`  ✗ ${brief.id}: ${error}`);
    }
  }

  return results;
}
