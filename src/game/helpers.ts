import { Graphics } from "engine/core/Graphics";

export function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function getRandomWordX(graphics: Graphics) {
  return Math.max(20, Math.random() * graphics.getWidth() - 20);
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

// todo find another place for job title logic
const multiplier = 2000;

const titles = [
  { name: "Junior", limit: 1 },
  { name: "Advanced Junior", limit: 1.4 },
  { name: "Regular", limit: 1.8 },
  { name: "Senior", limit: 2.4 },
  { name: "Strong Senior", limit: 3 },
  { name: "Staff", limit: 4 },
  { name: "Senior Staff", limit: 5 },
  { name: "Principal", limit: 7 },
];

export function getJobTitle(score: number) {
  const titleIndex =
    titles.findIndex(({ limit }) => limit * multiplier > score) || 0;

  return titles[titleIndex].name + " Engineer";
}
