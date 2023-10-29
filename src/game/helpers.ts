export function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function getRandomWordX() {
  return Math.random() * window.innerWidth - 20;
}

export function getRandomWordXNotCloseTo(x: number) {
  const side = x / window.innerWidth;

  if (side <= 0.5) {
    return (Math.random() * window.innerWidth) / 2 - 20 + window.innerWidth / 2;
  } else {
    return (Math.random() * window.innerWidth) / 2;
  }
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
