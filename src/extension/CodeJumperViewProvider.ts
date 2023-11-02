import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class CodeJumperViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType =
    "vertical-code-jumper.verticalCodeJumperView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  private isMusicEnabled() {
    return vscode.workspace
      .getConfiguration("vertical-code-jumper")
      .get<boolean>("enableMusic", true);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "getWords": {
          let words: string[] = [];

          if (vscode.window.activeTextEditor) {
            words = vscode.window.activeTextEditor.document
              .getText()
              .replace(/[^a-zA-Z0-9-_]/g, " ")
              .split(/\s+/gm)
              .filter((x) => x.length > 3);
          } else {
            const files = await vscode.workspace.findFiles(
              "**/**",
              undefined,
              100
            );
            words = files
              .filter((x) => x.path.length > 3)
              .map((x) => x.path.split("/").at(-1))
              .filter((x): x is string => !!x);
          }

          this._view?.webview.postMessage({
            type: "addWords",
            words: [...new Set(words)],
          });
          break;
        }
      }
    });
  }

  public restartGame() {
    if (this._view) {
      this._view.show(true);
      this._view.webview.postMessage({ type: "restartGame" });
    }
  }

  public setMusicEnabled(enabled: boolean) {
    if (this._view) {
      this._view.show(true);
      this._view.webview.postMessage({ type: "setMusicEnabled", enabled });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const workbenchConfig = vscode.workspace.getConfiguration("editor");
    const mediaFolder = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media")
    );

    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "game.js")
    );

    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">

        <!--
          Use a content security policy to only allow loading styles from our extension directory,
          and only allow scripts that have a specific nonce.
          (See the 'webview-sample' extension sample for img-src content security policy examples)
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
          webview.cspSource
        }; img-src ${webview.cspSource} https:; media-src ${
      webview.cspSource
    } https:; script-src 'nonce-${nonce}';">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          globalFontFamily = "${workbenchConfig.get("fontFamily")}";
          globalFontSize = ${workbenchConfig.get("fontSize")};
          mediaFolder = "${mediaFolder}";
          initialMusicEnabled = ${this.isMusicEnabled()};
          automaticResizeCanvas = true;
        </script>
        
        <title>Vertical Code Jumper</title>
      </head>
      <body>
        <canvas id="gameCanvas"></canvas>

        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}
