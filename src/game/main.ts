let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
let interval: NodeJS.Timer;

interface Entity {
  update(): void;
  render(): void;
}

class Ball implements Entity {
  cx: number;
  cy: number;
  private ballRadius = 20;

  constructor(cx: number, cy: number) {
    this.cx = cx;
    this.cy = cy;
  }

  update() {
    this.cy += 1;
  }

  render() {
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.ballRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#2ed851";
    // ctx.fillStyle = getColor("--vscode-editor-background");
    ctx.fill();
  }
}

class Word implements Entity {
  cx: number;
  cy: number;
  word: string;

  constructor(word: string, cx: number, cy: number) {
    this.word = word;
    this.cx = cx;
    this.cy = cy;
  }

  update() {
    this.cy += 1;
  }

  render() {
    ctx.fillStyle = getColor("--vscode-editor-foreground");
    // @ts-expect-error
    ctx.font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;
    ctx.fillText(this.word, this.cx, this.cy);
  }
}

function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}
var words = ["Rock", "Paper", "Scissor"];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function initCanvas() {
  canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  if (!canvas) {
    console.log("Canvas not ready");
    return;
  }

  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    console.log("Canvas context not ready");
    return;
  }

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  let tick = 0;
  const entities: Entity[] = [];
  const ball = new Ball(0, 0);
  entities.push(ball);

  clearInterval(interval);
  interval = setInterval(() => {
    entities.forEach((entity) => entity.update());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.forEach((entity) => entity.render());

    tick++;

    // each second
    if (tick % 100 === 0) {
      entities.push(
        new Word(
          getRandomWord(),
          0 + Math.random() * 100,
          50 + Math.random() * 20
        )
      );
    }
  }, 10);

  window.onmousemove = (ev) => {
    ev.preventDefault();
    ball.cx = ev.clientX;
    ball.cy = ev.clientY;
  };
}

window.addEventListener("resize", function () {
  initCanvas();
});

initCanvas();
