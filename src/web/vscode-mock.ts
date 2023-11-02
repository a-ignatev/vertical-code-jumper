import { WebviewApi } from "vscode-webview";

global.acquireVsCodeApi = <StateType = unknown>(): WebviewApi<StateType> => {
  let state: any = undefined;

  return {
    setState: <T extends StateType | undefined>(newState: T): T => {
      state = newState;

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
