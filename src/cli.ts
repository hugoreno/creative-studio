import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { loadBrief, loadBriefsFromDir } from "./brief/loader";
import { renderToPng } from "./renderer/png-render";
import { renderBatch } from "./renderer/batch";
import { generateBriefs } from "./brief/generator";
import { writeFile, mkdir } from "node:fs/promises";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    brief: { type: "string" },
    briefs: { type: "string" },
    output: { type: "string", default: "output" },
    insights: { type: "string" },
  },
});

const command = positionals[0];

async function main() {
  switch (command) {
    case "render": {
      if (values.brief) {
        // Render a single brief
        const briefPath = resolve(values.brief);
        const brief = await loadBrief(briefPath);
        const outputDir = resolve(values.output!);
        await mkdir(outputDir, { recursive: true });
        const png = await renderToPng(brief);
        const outputPath = resolve(outputDir, `${brief.id}.png`);
        await writeFile(outputPath, png);
        console.log(`Rendered: ${outputPath}`);
      } else if (values.briefs) {
        // Render all briefs in a directory
        const briefsDir = resolve(values.briefs);
        const outputDir = resolve(values.output!);
        const briefs = await loadBriefsFromDir(briefsDir);
        console.log(`Rendering ${briefs.length} briefs...`);
        const results = await renderBatch(briefs, outputDir);
        const succeeded = results.filter((r) => r.success).length;
        console.log(`Done: ${succeeded}/${results.length} succeeded`);
      } else {
        console.error("Usage: creative-studio render --brief <file> | --briefs <dir>");
        process.exit(1);
      }
      break;
    }

    case "generate-briefs": {
      if (!values.insights) {
        console.error("Usage: creative-studio generate-briefs --insights <file>");
        process.exit(1);
      }
      const insightsPath = resolve(values.insights);
      const outputDir = resolve("briefs/from-insights");
      const briefs = await generateBriefs(insightsPath, outputDir);
      console.log(`Generated ${briefs.length} briefs in ${outputDir}`);
      break;
    }

    default:
      console.error("Commands: render, generate-briefs");
      console.error("  render --brief <file>          Render a single brief to PNG");
      console.error("  render --briefs <dir>          Render all briefs in a directory");
      console.error("  generate-briefs --insights <f> Generate briefs from competitor insights");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
