import { WebviewApi } from "vscode-webview";
import { startGameLoop } from "engine/main";
import { SceneManager } from "engine/scenes/SceneManager";
import { Sound } from "engine/sound/Sound";
import { prepareCanvas } from "engine/utils/prepareCanvas";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Intro } from "./scenes/Intro";
import { Resize } from "./scenes/Resize";
import { debounce, isScreenTooSmall, isScreenTooWide } from "./helpers";

const DEBUG = false;

interface State {
  words: string[];
  music: boolean;
}

const music = new Sound("music.mp3", true);
music.setVolume(0.5);

let abortController = new AbortController();

function main() {
  const vscode = acquireVsCodeApi<State>();
  const state = getStateOrDefault(vscode);

  music.seMuted(!state.music);

  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addWords": {
        const state = getStateOrDefault(vscode);
        vscode.setState({ ...state, words: message.words });
        startGame(state.words, abortController.signal);
        break;
      }
      case "restartGame": {
        requestWords(vscode);
        break;
      }
      case "setMusicEnabled": {
        const state = getStateOrDefault(vscode);
        vscode.setState({ ...state, music: message.enabled });
        switchMusic(message.enabled);
        break;
      }
    }
  });

  window.addEventListener(
    "resize",
    debounce(function () {
      requestWords(vscode);
    }, 200)
  );

  requestWords(vscode);
}

function getStateOrDefault(vscode: WebviewApi<State>) {
  return (
    vscode.getState() || {
      words: [],
      music: initialMusicEnabled,
    }
  );
}

function switchMusic(enabled: boolean) {
  if (enabled) {
    music.seMuted(false);
    music.play();
  } else {
    music.stop();
    music.seMuted(true);
  }
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

  const sceneManager = new SceneManager(ctx);
  sceneManager.addScene("intro", new Intro(music));
  sceneManager.addScene("game", new Game(words));
  sceneManager.addScene("gameOver", new GameOver());
  sceneManager.addScene("resize", new Resize());

  if (isScreenTooSmall() || isScreenTooWide()) {
    sceneManager.switchScene("resize");
  } else {
    sceneManager.switchScene("intro");
  }

  startGameLoop(sceneManager, ctx, canvas, abortSignal, DEBUG);
}

main();
