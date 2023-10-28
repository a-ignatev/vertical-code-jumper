let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
let interval: NodeJS.Timer;

interface Context {
  entities: Entity[];
}

class Rect {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }

  intersects(other: Rect) {
    const rect1Right = this.x + this.width;
    const rect1Bottom = this.y + this.height;
    const rect2Right = other.x + other.width;
    const rect2Bottom = other.y + other.height;

    if (
      rect1Right < other.x ||
      rect2Right < this.x ||
      rect1Bottom < other.y ||
      rect2Bottom < this.y
    ) {
      return false;
    }

    return true;
  }
}

interface Entity {
  getBoundingRect(): Rect;
  update(context: Context): void;
  render(debug: boolean): void;
  shouldBeRemoved(): boolean;
}

class Ball implements Entity {
  speedX: number;
  speedY: number;
  private cx: number;
  private cy: number;
  private ballRadius = 20;
  private gravity = 3;

  constructor(cx: number, cy: number) {
    this.speedX = 0;
    this.speedY = this.gravity;
    this.speedY = this.cx = cx;
    this.cy = cy;
  }

  update(context: Context) {
    this.speedY += 0.1;
    this.speedY = Math.min(this.speedY, this.gravity);

    this.cx += this.speedX;
    this.cx = Math.max(
      this.ballRadius,
      Math.min(this.cx, window.innerWidth - this.ballRadius)
    );
    this.cy += this.speedY;

    context.entities.forEach((entity) => {
      if (entity === this) {
        return;
      }

      if (
        this.speedY > 0 &&
        this.getBoundingRect().intersects(entity.getBoundingRect())
      ) {
        this.speedY = -4;
      }
    });
  }

  render(debug: boolean) {
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.ballRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#2ed851";
    // ctx.fillStyle = getColor("--vscode-editor-background");
    ctx.fill();

    if (debug) {
      this.getBoundingRect().render();
    }
  }

  shouldBeRemoved(): boolean {
    return this.cy - 2 * this.ballRadius > window.innerHeight;
  }

  getBoundingRect(): Rect {
    return new Rect(
      this.cx - this.ballRadius,
      this.cy + this.ballRadius - 1,
      2 * this.ballRadius,
      1
    );
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

  render(debug: boolean) {
    ctx.fillStyle = getColor("--vscode-editor-foreground");
    // @ts-expect-error
    ctx.font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;
    ctx.fillText(this.word, this.cx, this.cy);

    if (debug) {
      this.getBoundingRect().render();
    }
  }

  shouldBeRemoved(): boolean {
    // @ts-expect-error
    return this.cy - globalFontSize > window.innerHeight;
  }

  getBoundingRect(): Rect {
    const measure = ctx.measureText(this.word);

    return new Rect(
      this.cx,
      // @ts-expect-error
      this.cy - globalFontSize,
      measure.width,
      // @ts-expect-error
      globalFontSize
    );
  }
}

function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function getRandomWord(words: string[]) {
  return words[Math.floor(Math.random() * words.length)];
}

function getRandomWordX() {
  return Math.random() * window.innerWidth - 20;
}

// @ts-expect-error
const vscode = acquireVsCodeApi();

function initCanvas() {
  const state = vscode.getState() || { words: [] };
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
  let entities: Entity[] = [];
  const ball = new Ball(window.innerWidth / 2, 0);
  entities.push(ball);

  // init initial words
  let y = 0;
  while (y * 100 <= window.innerHeight) {
    entities.push(
      new Word(getRandomWord(state.words), getRandomWordX(), y * 100)
    );
    y++;
  }

  // game loop
  clearInterval(interval);
  interval = setInterval(() => {
    entities.forEach((entity) => entity.update({ entities }));
    entities = entities.filter((entity) => !entity.shouldBeRemoved());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.forEach((entity) => entity.render(false));

    tick++;

    // each second add new word
    if (tick % 100 === 0) {
      entities.push(new Word(getRandomWord(state.words), getRandomWordX(), 0));
    }
  }, 10);

  let holdingKeys: string[] = [];
  window.onkeydown = (ev) => {
    ev.preventDefault();
    if (ev.key === "ArrowLeft") {
      ball.speedX = -3;
      holdingKeys.push(ev.key);
    }
    if (ev.key === "ArrowRight") {
      ball.speedX = 3;
      holdingKeys.push(ev.key);
    }
  };
  window.onkeyup = (ev) => {
    ev.preventDefault();
    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
      holdingKeys = holdingKeys.filter((key) => key !== ev.key);
      if (!holdingKeys.length) {
        ball.speedX = 0;
      }
    }
  };

  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addWords": {
        vscode.setState({ words: message.words });
        break;
      }
      case "restartGame": {
        initCanvas();
      }
    }
  });
  vscode.postMessage({ type: "getWords" });
}

window.addEventListener("resize", function () {
  initCanvas();
});

initCanvas();
