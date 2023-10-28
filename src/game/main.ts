import { Word } from "./entities/Word";
import { Guy, SIDE_SPEED } from "./entities/Guy";
import { Entity } from "./entities/Entity";
import { WebviewApi } from "vscode-webview";

const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";
const SPAWN_SPEED = 1;

interface State {
  words: string[];
}

let abortController = new AbortController();

function main() {
  const vscode = acquireVsCodeApi<State>();
  console.log(imgFolder);

  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addWords": {
        vscode.setState({ words: message.words });
        const state = vscode.getState() || { words: [] };
        init(state.words, abortController.signal);
        break;
      }
      case "restartGame": {
        requestWords(vscode);
      }
    }
  });

  window.addEventListener("resize", function () {
    requestWords(vscode);
  });

  requestWords(vscode);
}

function requestWords(vscode: WebviewApi<State>) {
  resetAll();
  abortController = new AbortController();
  vscode.postMessage({ type: "getWords" });
}

function resetAll() {
  abortController.abort();
  const graphics = initCanvas();

  if (!graphics) {
    return;
  }

  window.requestAnimationFrame(() => {
    const { canvas, ctx } = graphics;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
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
  ctx.imageSmoothingEnabled = false;

  return { ctx, canvas };
}

function initEntities(words: string[]) {
  let entities: Entity[] = [];
  const guy = new Guy(window.innerWidth / 2, 0);
  entities.push(guy);

  // TODO refactor
  // create initial words
  let y = 1;
  while (y * 100 <= window.innerHeight) {
    const randomWord = Word.randomWord(words);
    randomWord.y = y * 100;
    entities.push(randomWord);
    y++;
  }

  return entities;
}

function initGameLoop(
  words: string[],
  entities: Entity[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  abortSignal: AbortSignal
) {
  let lastSpawn = 0;
  let lastTimeStamp = 0;

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
      entities.push(Word.randomWord(words));
    }

    lastTimeStamp = timeStamp;
    if (!abortSignal.aborted) {
      window.requestAnimationFrame(gameLoop);
    }
  }
  window.requestAnimationFrame(gameLoop);
}

function init(words: string[], abortSignal: AbortSignal) {
  const graphics = initCanvas();
  if (!graphics) {
    return;
  }

  const { ctx, canvas } = graphics;
  const entities = initEntities(words);
  initGameLoop(words, entities, ctx, canvas, abortSignal);

  const guy = entities.find((entity) => entity instanceof Guy);

  if (guy) {
    handleControls(guy as Guy);
  }
}

function handleControls(guy: Guy) {
  let holdingKeys: string[] = [];

  window.onkeydown = (event) => {
    event.preventDefault();
    if (event.key === LEFT_KEY) {
      guy.speedX = -SIDE_SPEED;
      holdingKeys.push(event.key);
    }
    if (event.key === RIGHT_KEY) {
      guy.speedX = SIDE_SPEED;
      holdingKeys.push(event.key);
    }
  };

  window.onkeyup = (event) => {
    event.preventDefault();
    if (event.key === LEFT_KEY || event.key === RIGHT_KEY) {
      holdingKeys = holdingKeys.filter((key) => key !== event.key);

      if (!holdingKeys.length) {
        guy.speedX = 0;
      }
    }
  };
}

main();
