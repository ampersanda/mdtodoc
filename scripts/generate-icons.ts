import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const sizes = [192, 512];
const svgPath = join(import.meta.dir, "..", "public", "favicon.svg");
const svg = readFileSync(svgPath, "utf-8");

for (const size of sizes) {
  const resvg = await import("@resvg/resvg-js").catch(() => null);

  if (resvg) {
    const opts = { fitTo: { mode: "width" as const, value: size } };
    const result = new resvg.Resvg(svg, opts).render();
    const outPath = join(import.meta.dir, "..", "public", `icon-${size}.png`);
    writeFileSync(outPath, result.asPng());
    console.log(`Generated icon-${size}.png`);
  } else {
    // Fallback: generate minimal PNG with canvas
    console.log(
      `@resvg/resvg-js not available. Generating icon-${size}.png with canvas...`
    );
    await generateWithCanvas(size, svg);
  }
}

async function generateWithCanvas(size: number, _svg: string) {
  // Create a minimal PNG programmatically using bun's built-in APIs
  // We'll draw the icon concept directly
  const { createCanvas } = await import("canvas").catch(() => {
    console.error(
      `Neither @resvg/resvg-js nor canvas package available.\n` +
        `Install one: bun add -d @resvg/resvg-js\n` +
        `Then re-run: bun scripts/generate-icons.ts`
    );
    process.exit(1);
    return null as never;
  });

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const scale = size / 128;

  // Background rounded rect
  ctx.fillStyle = "#1f2937";
  roundRect(ctx, 16 * scale, 4 * scale, 96 * scale, 120 * scale, 8 * scale);
  ctx.fill();

  // Inner white area
  ctx.fillStyle = "#f9fafb";
  roundRect(ctx, 22 * scale, 10 * scale, 84 * scale, 108 * scale, 5 * scale);
  ctx.fill();

  // "md" text
  ctx.fillStyle = "#1f2937";
  ctx.font = `bold ${40 * scale}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("md", 64 * scale, 58 * scale);

  // Decorative lines
  ctx.fillStyle = "#d1d5db";
  roundRect(ctx, 36 * scale, 88 * scale, 56 * scale, 4 * scale, 2 * scale);
  ctx.fill();
  roundRect(ctx, 44 * scale, 98 * scale, 40 * scale, 4 * scale, 2 * scale);
  ctx.fill();

  const outPath = join(import.meta.dir, "..", "public", `icon-${size}.png`);
  writeFileSync(outPath, canvas.toBuffer("image/png"));
  console.log(`Generated icon-${size}.png (canvas fallback)`);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
