import { WebviewApi } from "vscode-webview";
import { Graphics } from "engine/core/Graphics";
import { prepareGraphics, resetGraphics } from "engine/core/helpers";
import { startGameLoop } from "engine/main";
import { SceneManager } from "engine/scenes/SceneManager";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Intro } from "./scenes/Intro";
import { Loading } from "./scenes/Loading";
import { Resize } from "./scenes/Resize";
import { debounce } from "./helpers";

const DEBUG = false;

interface State {
  words: string[];
  music: boolean;
}

function getStateOrDefault(vscode: WebviewApi<State>) {
  return (
    vscode.getState() || {
      words: [],
      music: initialMusicEnabled,
    }
  );
}

let abortController = new AbortController();

function main() {
  const vscode = acquireVsCodeApi<State>();

  const graphics = prepareGraphics(globalFontSize, globalFontFamily);

  if (!graphics) {
    return;
  }

  // setup game
  const sceneManager = new SceneManager(graphics);
  sceneManager.addScene("intro", Intro);
  const state = getStateOrDefault(vscode);
  const gameScene = sceneManager.addScene("game", Game, [], state.music);
  sceneManager.addScene("gameOver", GameOver);
  sceneManager.addScene("resize", Resize);
  sceneManager.addScene("loading", Loading);

  // start game
  startGameLoop(sceneManager, graphics, abortController.signal, DEBUG);

  // subscribe to external events
  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.type) {
      case "addWords": {
        const state = getStateOrDefault(vscode);
        vscode.setState({ ...state, words: message.words });

        gameScene.setWords(message.words);
        sceneManager.switchScene("intro");
        break;
      }
      case "restartGame": {
        init(graphics, sceneManager, vscode);

        break;
      }
      case "setMusicEnabled": {
        const state = getStateOrDefault(vscode);
        vscode.setState({ ...state, music: message.enabled });
        gameScene.switchMusic(message.enabled);
        break;
      }
    }
  });

  window.addEventListener(
    "resize",
    debounce(function () {
      init(graphics, sceneManager, vscode);
    }, 200)
  );

  init(graphics, sceneManager, vscode);
}

function init(
  graphics: Graphics,
  sceneManager: SceneManager,
  vscode: WebviewApi<State>
) {
  resetGraphics();

  if (graphics.isScreenTooSmall() || graphics.isScreenTooWide()) {
    sceneManager.switchScene("resize");
  } else {
    sceneManager.switchScene("loading");
    vscode.postMessage({ type: "getWords" });
  }
}

main();
