import { WebviewApi } from "vscode-webview";
import { prepareGraphics } from "engine/graphics/prepareGraphics";
import { startGameLoop } from "engine/main";
import { SceneManager } from "engine/scenes/SceneManager";
import { Sound } from "engine/sound/Sound";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Intro } from "./scenes/Intro";
import { Resize } from "./scenes/Resize";
import { debounce } from "./helpers";

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
        startGame(message.words, abortController.signal);
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
  const graphics = prepareGraphics(globalFontSize, globalFontFamily);

  if (!graphics) {
    return;
  }

  window.requestAnimationFrame(() => {
    graphics.clearScreen();
  });
}

function startGame(words: string[], abortSignal: AbortSignal) {
  const graphics = prepareGraphics(globalFontSize, globalFontFamily);

  if (!graphics) {
    return;
  }

  const sceneManager = new SceneManager(graphics);
  sceneManager.addScene("intro", new Intro(music));
  sceneManager.addScene("game", new Game(words));
  sceneManager.addScene("gameOver", new GameOver(music));
  sceneManager.addScene("resize", new Resize());

  if (graphics.isScreenTooSmall() || graphics.isScreenTooWide()) {
    sceneManager.switchScene("resize");
  } else {
    sceneManager.switchScene("intro");
  }

  startGameLoop(sceneManager, graphics, abortSignal, DEBUG);
}

main();
