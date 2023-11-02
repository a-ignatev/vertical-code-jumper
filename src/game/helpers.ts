import { Graphics } from "engine/graphics/Graphics";

export function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function getRandomWordX(graphics: Graphics) {
  return Math.random() * graphics.getWidth() - 20;
}

export function getRandomWordXNotCloseTo(graphics: Graphics, x: number) {
  const side = x / graphics.getWidth();

  if (side < 0.5) {
    return (
      (Math.random() * graphics.getWidth()) / 2 - 20 + graphics.getWidth() / 2
    );
  } else if (side > 0.5) {
    return (Math.random() * graphics.getWidth()) / 2;
  }

  return getRandomWordX(graphics);
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
