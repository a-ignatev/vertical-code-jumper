import { WebviewApi } from "vscode-webview";
import { Game } from "./scenes/Game";
import { Intro } from "./scenes/Intro";
import { SceneManager } from "../engine/scenes/SceneManager";
import { GameOver } from "./scenes/GameOver";
import { startGameLoop } from "../engine/main";
import { prepareCanvas } from "../engine/utils/prepareCanvas";

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
        startGame(state.words, abortController.signal);
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
  const graphics = prepareCanvas(globalFontSize, globalFontFamily);

  if (!graphics) {
    return;
  }

  window.requestAnimationFrame(() => {
    const { canvas, ctx } = graphics;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function startGame(words: string[], abortSignal: AbortSignal) {
  const graphics = prepareCanvas(globalFontSize, globalFontFamily);
  if (!graphics) {
    return;
  }

  const { ctx, canvas } = graphics;

  const sceneManager = new SceneManager();
  sceneManager.addScene("intro", new Intro(ctx));
  sceneManager.addScene("game", new Game(words));
  sceneManager.addScene("gameOver", new GameOver(ctx));
  sceneManager.switchScene("intro");

  startGameLoop(sceneManager, ctx, canvas, abortSignal, DEBUG);
}

main();
