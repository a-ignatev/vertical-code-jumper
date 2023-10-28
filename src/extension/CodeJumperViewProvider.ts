import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class CodeJumperViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType =
    "vertical-code-jumper.verticalCodeJumperView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "getWords": {
          const words = vscode.window.activeTextEditor?.document
            .getText()
            .replace(/[^a-zA-Z0-9-_]/g, " ")
            .split(/\s+/gm)
            .filter((x) => x.length > 3);
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
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: "restartGame" });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const workbenchConfig = vscode.workspace.getConfiguration("editor");

    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main-bundle.js")
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
        }; script-src 'nonce-${nonce}';">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          globalFontFamily = "${workbenchConfig.get("fontFamily")}";
          globalFontSize = ${workbenchConfig.get("fontSize")};
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
