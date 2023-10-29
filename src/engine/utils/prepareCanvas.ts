export function prepareCanvas(fontSizePx: number, fontFamily: string) {
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

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  ctx.font = `${fontSizePx}px ${fontFamily.split(",")[0]}`;

  return { ctx, canvas };
}
