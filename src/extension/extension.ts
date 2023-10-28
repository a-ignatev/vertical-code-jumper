import * as vscode from "vscode";
import { CodeJumperViewProvider } from "./CodeJumperViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new CodeJumperViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CodeJumperViewProvider.viewType,
      provider
    )
  );

  vscode.commands.registerCommand("vertical-code-jumper.restartGame", () => {
    provider.restartGame();
  });
}
