export function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function getRandomWordX(ctx: CanvasRenderingContext2D) {
  return Math.random() * ctx.canvas.width - 20;
}

export function getRandomWordXNotCloseTo(
  ctx: CanvasRenderingContext2D,
  x: number
) {
  const side = x / ctx.canvas.width;

  if (side < 0.5) {
    return (Math.random() * ctx.canvas.width) / 2 - 20 + ctx.canvas.width / 2;
  } else if (side > 0.5) {
    return (Math.random() * ctx.canvas.width) / 2;
  }

  return getRandomWordX(ctx);
}

export function debounce(func: () => void, time: number) {
  var timer: NodeJS.Timeout | undefined;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(func, time);
  };
}

export function isScreenTooSmall(ctx: CanvasRenderingContext2D) {
  return ctx.canvas.width < 350;
}

export function isScreenTooWide(ctx: CanvasRenderingContext2D) {
  return ctx.canvas.width > 500;
}
