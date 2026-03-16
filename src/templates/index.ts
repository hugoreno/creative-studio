import { HeroImage } from "./hero-image";
import { TextOverlay } from "./text-overlay";
import { SplitScreen } from "./split-screen";

export const templates = {
  "hero-image": HeroImage,
  "text-overlay": TextOverlay,
  "split-screen": SplitScreen,
} as const;

export type TemplateName = keyof typeof templates;

export function getTemplate(name: TemplateName) {
  return templates[name];
}
