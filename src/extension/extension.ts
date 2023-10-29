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

  vscode.commands.registerCommand("vertical-code-jumper.enableMusic", () => {
    const configuration = vscode.workspace.getConfiguration(
      "vertical-code-jumper"
    );
    configuration
      .update("enableMusic", true, vscode.ConfigurationTarget.Global)
      .then(() => {
        provider.setMusicEnabled(true);
      });
  });

  vscode.commands.registerCommand("vertical-code-jumper.disableMusic", () => {
    const configuration = vscode.workspace.getConfiguration(
      "vertical-code-jumper"
    );
    configuration
      .update("enableMusic", false, vscode.ConfigurationTarget.Global)
      .then(() => {
        provider.setMusicEnabled(false);
      });
  });
}
