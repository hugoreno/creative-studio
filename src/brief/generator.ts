import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { CompetitorInsightsSchema } from "../lib/schemas";
import type { CreativeBrief, LayoutPattern } from "../lib/types";
import { tokens } from "../lib/tokens";

const TEMPLATE_MAP: Record<string, CreativeBrief["template"]> = {
  "hero-image-top": "hero-image",
  "text-overlay": "text-overlay",
  "split-screen": "split-screen",
  "character-focused": "hero-image",
  "jackpot-showcase": "text-overlay",
};

const LUCKY_LINE_CTAS = [
  "Board the Lucky Line!",
  "Play Now — Free Coins!",
  "Ride to Riches!",
  "Spin & Win Big!",
  "Claim Your Free Ride!",
  "All Aboard!",
];

const LUCKY_LINE_HEADLINES = [
  "Your Winning Journey Starts Here",
  "Ride the Train to Jackpot City",
  "Spin, Win & Collect",
  "The Luckiest Ride in Town",
  "Free Coins Await",
  "Next Stop: Big Wins",
];

const SIZES: CreativeBrief["size"][] = ["square", "landscape", "story"];

export async function generateBriefs(
  insightsPath: string,
  outputDir: string
): Promise<CreativeBrief[]> {
  const raw = await readFile(insightsPath, "utf-8");
  const insights = CompetitorInsightsSchema.parse(JSON.parse(raw));

  const briefs: CreativeBrief[] = [];
  let counter = 0;

  // Determine layout distribution from competitor ads
  const layoutCounts = new Map<string, number>();
  for (const ad of insights.ads) {
    layoutCounts.set(ad.layout, (layoutCounts.get(ad.layout) ?? 0) + 1);
  }

  // Generate briefs proportional to layout distribution
  const totalAds = insights.ads.length || 1;
  for (const [layout, count] of layoutCounts) {
    const template = TEMPLATE_MAP[layout] ?? "hero-image";
    const briefCount = Math.max(1, Math.round((count / totalAds) * 6));

    for (let i = 0; i < briefCount; i++) {
      for (const size of SIZES) {
        const brief: CreativeBrief = {
          id: `auto-${insights.competitor.toLowerCase().replace(/\s+/g, "-")}-${counter++}`,
          template,
          size,
          props: {
            headline: LUCKY_LINE_HEADLINES[counter % LUCKY_LINE_HEADLINES.length],
            cta: LUCKY_LINE_CTAS[counter % LUCKY_LINE_CTAS.length],
          },
          metadata: {
            generatedFrom: layout,
            sourceInsights: insightsPath,
          },
        };
        briefs.push(brief);
      }
    }
  }

  // Write briefs to output directory
  await mkdir(outputDir, { recursive: true });
  for (const brief of briefs) {
    await writeFile(
      join(outputDir, `${brief.id}.json`),
      JSON.stringify(brief, null, 2)
    );
  }

  return briefs;
}
