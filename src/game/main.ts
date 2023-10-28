import { Word } from "./entities/Word";
import { Ball, SIDE_SPEED } from "./entities/Ball";
import { Entity } from "./entities/Entity";
import { WebviewApi } from "vscode-webview";

const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";
const SPAWN_SPEED = 1;

interface State {
  words: string[];
}

function main() {
  const vscode = acquireVsCodeApi<State>();

  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addWords": {
        vscode.setState({ words: message.words });
        break;
      }
      case "restartGame": {
        initAll(vscode);
      }
    }
  });

  window.addEventListener("resize", function () {
    initAll(vscode);
  });

  vscode.postMessage({ type: "getWords" });

  initAll(vscode);
}

function initCanvas() {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  if (!canvas) {
    console.log("Canvas not ready");
    return;
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    console.log("Canvas context not ready");
    return;
  }

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  return { ctx, canvas };
}

function initEntities(vscode: WebviewApi<State>) {
  let entities: Entity[] = [];
  const ball = new Ball(window.innerWidth / 2, 0);
  entities.push(ball);

  const state = vscode.getState() || { words: [] };
  // init initial words
  let y = 0;
  while (y * 100 <= window.innerHeight) {
    const randomWord = Word.randomWord(state.words);
    randomWord.y = y * 100;
    entities.push(randomWord);
    y++;
  }

  return entities;
}

function initGameLoop(
  vscode: WebviewApi<State>,
  entities: Entity[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  let lastSpawn = 0;
  let lastTimeStamp = 0;
  const state = vscode.getState() || { words: [] };

  function gameLoop(timeStamp: number) {
    const delta = timeStamp - lastTimeStamp;

    // update entities
    entities.forEach((entity) => entity.update({ entities, delta, ctx }));
    entities = entities.filter((entity) => !entity.shouldBeRemoved());

    // clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render entities
    entities.forEach((entity) => entity.render(ctx, false));

    // spawn new words
    let timeInSecond = timeStamp / 1000;
    if (timeInSecond - lastSpawn >= SPAWN_SPEED) {
      lastSpawn = timeInSecond;
      entities.push(Word.randomWord(state.words));
    }

    lastTimeStamp = timeStamp;
    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);
}

function initAll(vscode: WebviewApi<State>) {
  const graphics = initCanvas();
  if (!graphics) {
    return;
  }

  const { ctx, canvas } = graphics;
  const entities = initEntities(vscode);
  initGameLoop(vscode, entities, ctx, canvas);

  const ball = entities.find((entity) => entity instanceof Ball);

  if (ball) {
    handleControls(ball as Ball);
  }
}

function handleControls(ball: Ball) {
  let holdingKeys: string[] = [];

  window.onkeydown = (event) => {
    event.preventDefault();
    if (event.key === LEFT_KEY) {
      ball.speedX = -SIDE_SPEED;
      holdingKeys.push(event.key);
    }
    if (event.key === RIGHT_KEY) {
      ball.speedX = SIDE_SPEED;
      holdingKeys.push(event.key);
    }
  };

  window.onkeyup = (event) => {
    event.preventDefault();
    if (event.key === LEFT_KEY || event.key === RIGHT_KEY) {
      holdingKeys = holdingKeys.filter((key) => key !== event.key);

      if (!holdingKeys.length) {
        ball.speedX = 0;
      }
    }
  };
}

main();
