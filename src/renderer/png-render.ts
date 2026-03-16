import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CreativeBrief } from "../lib/types";
import { renderToSvg } from "./satori-render";

let wasmInitialized = false;

async function ensureWasm() {
  if (wasmInitialized) return;
  const wasmPath = join(
    process.cwd(),
    "node_modules",
    "@resvg",
    "resvg-wasm",
    "index_bg.wasm"
  );
  const wasmBuffer = await readFile(wasmPath);
  await initWasm(wasmBuffer);
  wasmInitialized = true;
}

export async function renderToPng(brief: CreativeBrief): Promise<Buffer> {
  await ensureWasm();
  const svg = await renderToSvg(brief);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "original" },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
