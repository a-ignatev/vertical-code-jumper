import { WebviewApi } from "vscode-webview";
import { Game } from "./scenes/Game";
import { Intro } from "./scenes/Intro";
import { SceneManager } from "./scenes/SceneManager";

export const LEFT_KEY = "ArrowLeft";
export const RIGHT_KEY = "ArrowRight";
const DEBUG = false;

interface State {
  words: string[];
}

let abortController = new AbortController();

function main() {
  const vscode = acquireVsCodeApi<State>();

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
  ctx.font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;

  return { ctx, canvas };
}

function init(words: string[], abortSignal: AbortSignal) {
  const graphics = initCanvas();
  if (!graphics) {
    return;
  }

  const { ctx, canvas } = graphics;

  const sceneManager = new SceneManager();
  sceneManager.addScene("intro", new Intro(ctx));
  sceneManager.addScene("game", new Game(words));
  sceneManager.switchScene("intro");

  initGameLoop(sceneManager, ctx, canvas, abortSignal);
}

function initGameLoop(
  sceneManager: SceneManager,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  abortSignal: AbortSignal
) {
  let lastTimeStamp = 0;

  function gameLoop(timeStamp: number) {
    const scene = sceneManager.getScene();

    if (!scene) {
      console.log("No scene set");
      return;
    }

    const delta = timeStamp - lastTimeStamp;

    // update entities
    scene.entities.forEach((entity) =>
      entity.update({ entities: scene.entities, delta, ctx })
    );
    scene.entities = scene.entities.filter(
      (entity) => !entity.shouldBeRemoved()
    );

    // clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render entities
    scene.entities.forEach((entity) => entity.render(ctx, DEBUG));

    lastTimeStamp = timeStamp;
    if (!abortSignal.aborted) {
      window.requestAnimationFrame(gameLoop);
    }
  }
  window.requestAnimationFrame(gameLoop);
}

main();
