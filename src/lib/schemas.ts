import { z } from "zod";

export const AdSizeSchema = z.enum(["square", "landscape", "story"]);

export const CreativeBriefSchema = z.object({
  id: z.string(),
  template: z.enum(["hero-image", "text-overlay", "split-screen"]),
  size: AdSizeSchema,
  props: z.object({
    headline: z.string(),
    cta: z.string(),
    backgroundImage: z.string().optional(),
    characterImage: z.string().optional(),
    colorOverrides: z
      .object({
        background: z.string().optional(),
        headlineColor: z.string().optional(),
        ctaBackground: z.string().optional(),
        ctaColor: z.string().optional(),
      })
      .optional(),
  }),
  metadata: z
    .object({
      generatedFrom: z.string().optional(),
      sourceInsights: z.string().optional(),
    })
    .optional(),
});

export type CreativeBrief = z.infer<typeof CreativeBriefSchema>;
export type AdSize = z.infer<typeof AdSizeSchema>;
