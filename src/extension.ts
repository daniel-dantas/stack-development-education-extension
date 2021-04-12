// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { NodeDependenciesProvider } from "./commands/NodeDependenciesProvider";
import Search from "./commands/Search";
import { StatusBarUI } from "./View/StatusBarUI";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "extension-teste" is now active!'
  );
  // vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
  //   nodeDependenciesProvider.r
  // );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension-teste.helloWorld",
    () => {
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from extension-teste!");
    }
  );

  let searchItem = vscode.commands.registerCommand(
    "extension-teste.getResult",
    Search.getResult
  );

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(searchItem);
  context.subscriptions.push(StatusBarUI.statusBar);
}

// this method is called when your extension is deactivated
export function deactivate() {}
