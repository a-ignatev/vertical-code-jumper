import { Graphics } from "engine/core/Graphics";

export function prepareGraphics(fontSizePx: number, fontFamily: string) {
  const canvas = document.getElementById(
    "gameCanvas"
  ) as HTMLCanvasElement | null;

  if (!canvas) {
    console.log("Canvas not ready");

    return;
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;

  if (!ctx) {
    console.log("Canvas context not ready");

    return;
  }

  if (automaticResizeCanvas) {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  ctx.imageSmoothingEnabled = false;
  ctx.font = `${fontSizePx}px ${fontFamily.split(",")[0]}`;

  return new Graphics(ctx);
}

export function resetGraphics() {
  const graphics = prepareGraphics(globalFontSize, globalFontFamily);

  if (!graphics) {
    return;
  }

  window.requestAnimationFrame(() => {
    graphics.clearScreen();
  });
}
