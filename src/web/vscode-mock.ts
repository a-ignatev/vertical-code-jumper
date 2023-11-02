import { WebviewApi } from "vscode-webview";

const itemInStorage = localStorage.getItem("vertical-code-jumper.state");
let state: any = (itemInStorage && JSON.parse(itemInStorage)) || {
  music: initialMusicEnabled,
};

global.acquireVsCodeApi = <StateType = unknown>(): WebviewApi<StateType> => {
  return {
    setState: <T extends StateType | undefined>(newState: T): T => {
      state = newState;
      localStorage.setItem("vertical-code-jumper.state", JSON.stringify(state));

      return state;
    },
    getState: () => {
      return state;
    },
    postMessage(message: any) {
      if (message.type === "getWords") {
        window.postMessage({
          type: "addWords",
          words: ["hello", "world", "good"],
        });
      }
    },
  };
};

const musicButton = document.getElementById("musicSwitcher");

if (musicButton) {
  musicButton.innerHTML = state.music ? "Music: ON" : "Music: OFF";

  musicButton.addEventListener("click", () => {
    const state = acquireVsCodeApi<{ music: boolean }>().getState();
    musicButton.innerHTML = !state?.music ? "Music: ON" : "Music: OFF";

    window.postMessage({
      type: "setMusicEnabled",
      enabled: !state?.music,
    });
  });
}

const restartButton = document.getElementById("restartButton");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    window.postMessage({
      type: "restartGame",
    });
  });
}
