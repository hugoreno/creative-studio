"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { tokens } from "@bordo/ui";
import type { CreativeBrief } from "@bordo/ad-insights";
import { HeroImage } from "../src/templates/hero-image";
import { TextOverlay } from "../src/templates/text-overlay";
import { SplitScreen } from "../src/templates/split-screen";

type TemplateName = "hero-image" | "text-overlay" | "split-screen";
type AdSize = "square" | "landscape" | "story";

const TEMPLATES: { value: TemplateName; label: string }[] = [
  { value: "hero-image", label: "Hero Image" },
  { value: "text-overlay", label: "Text Overlay" },
  { value: "split-screen", label: "Split Screen" },
];

const SIZES: { value: AdSize; label: string; dim: string }[] = [
  { value: "square", label: "Square", dim: "1080 × 1080" },
  { value: "landscape", label: "Landscape", dim: "1200 × 628" },
  { value: "story", label: "Story", dim: "1080 × 1920" },
];

const templateComponents = {
  "hero-image": HeroImage,
  "text-overlay": TextOverlay,
  "split-screen": SplitScreen,
} as const;

export default function CreativeStudioPage() {
  const [template, setTemplate] = useState<TemplateName>("hero-image");
  const [size, setSize] = useState<AdSize>("square");
  const [headline, setHeadline] = useState("Your Winning Journey Starts Here");
  const [cta, setCta] = useState("Board the Lucky Line!");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [bgColor, setBgColor] = useState<string>(tokens.colors.navy);
  const [headlineColor, setHeadlineColor] = useState<string>(tokens.colors.gold);
  const [ctaBg, setCtaBg] = useState<string>(tokens.colors.ruby);
  const [ctaColor, setCtaColor] = useState<string>(tokens.colors.white);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const brief: CreativeBrief = useMemo(
    () => ({
      id: `preview-${template}-${size}`,
      template,
      size,
      props: {
        headline,
        cta,
        backgroundImage: backgroundImage || undefined,
        colorOverrides: {
          background: bgColor,
          headlineColor,
          ctaBackground: ctaBg,
          ctaColor,
        },
      },
    }),
    [template, size, headline, cta, backgroundImage, bgColor, headlineColor, ctaBg, ctaColor]
  );

  const dimensions = tokens.sizes.ad[size];
  const Template = templateComponents[template];

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${brief.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }, [brief]);

  const handleExportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [brief]);

  const handleImportJson = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text) as CreativeBrief;
        setTemplate(imported.template);
        setSize(imported.size);
        setHeadline(imported.props.headline);
        setCta(imported.props.cta);
        setBackgroundImage(imported.props.backgroundImage ?? "");
        setBgColor(imported.props.colorOverrides?.background ?? tokens.colors.navy);
        setHeadlineColor(imported.props.colorOverrides?.headlineColor ?? tokens.colors.gold);
        setCtaBg(imported.props.colorOverrides?.ctaBackground ?? tokens.colors.ruby);
        setCtaColor(imported.props.colorOverrides?.ctaColor ?? tokens.colors.white);
      } catch {
        alert("Invalid brief JSON");
      }
    };
    input.click();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[360px] shrink-0 overflow-y-auto border-r border-white/10 bg-[#12122a] p-5 flex flex-col gap-5">
        <h1 className="text-lg font-bold tracking-tight">Creative Studio</h1>

        {/* Template selector */}
        <Section label="Template">
          <div className="flex gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTemplate(t.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  template === t.value
                    ? "bg-[#D4A853] text-[#1A1A2E]"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Size selector */}
        <Section label="Size">
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  size === s.value
                    ? "bg-[#D4A853] text-[#1A1A2E]"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div>{s.label}</div>
                <div className="opacity-60">{s.dim}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Text inputs */}
        <Section label="Headline">
          <textarea
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-[#D4A853] focus:outline-none"
          />
        </Section>

        <Section label="Call to Action">
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-[#D4A853] focus:outline-none"
          />
        </Section>

        <Section label="Background Image URL">
          <input
            type="text"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-[#D4A853] focus:outline-none"
          />
        </Section>

        {/* Color pickers */}
        <Section label="Colors">
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
            <ColorPicker label="Headline" value={headlineColor} onChange={setHeadlineColor} />
            <ColorPicker label="CTA Background" value={ctaBg} onChange={setCtaBg} />
            <ColorPicker label="CTA Text" value={ctaColor} onChange={setCtaColor} />
          </div>
        </Section>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-5">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full rounded-lg bg-[#C41E3A] px-4 py-3 text-sm font-bold transition hover:bg-[#E63956] disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export PNG"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleExportJson}
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10"
            >
              Export JSON
            </button>
            <button
              onClick={handleImportJson}
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10"
            >
              Import JSON
            </button>
          </div>
        </div>
      </aside>

      {/* Preview panel */}
      <main className="flex flex-1 items-center justify-center overflow-auto bg-[#0f0f20] p-8" ref={previewRef}>
        <PreviewContainer width={dimensions.width} height={dimensions.height}>
          <Template brief={brief} />
        </PreviewContainer>
      </main>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</label>
      {children}
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
      />
      <span className="text-xs text-white/70">{label}</span>
    </label>
  );
}

function PreviewContainer({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  // Scale the full-resolution template to fit the viewport
  const maxW = 700;
  const maxH = 750;
  const scale = Math.min(maxW / width, maxH / height);

  return (
    <div
      className="rounded-lg shadow-2xl"
      style={{
        width: width * scale,
        height: height * scale,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
