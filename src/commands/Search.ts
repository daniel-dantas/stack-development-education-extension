import * as vscode from "vscode";
import { Terminal, window } from "vscode";
import axios from "axios";
import { NodeDependenciesProvider } from "./NodeDependenciesProvider";

class Search {
  public static async getResult() {
    const options: vscode.InputBoxOptions = {
      placeHolder: "Search",
      prompt: "*Required",
    };

    const dependencieProvider = new NodeDependenciesProvider(
      (vscode.workspace.workspaceFolders as any[])[0]?.uri.fsPath
    );

    const dependenciesProject = await dependencieProvider.getChildren();

    const value = await vscode.window.showInputBox(options);

    const dependenciesFilter = dependenciesProject
      .map((dependecy) => dependecy.label)
      .filter((value) => !value.startsWith("@"));

    if (value) {
      axios
        .get(
          `https://api.stackexchange.com/2.2/search/advanced?pagesize=100&order=desc&tagged=${dependenciesFilter.join(
            ";"
          )}&sort=activity&q=${value}&site=stackoverflow`
        )
        .then((response) => {
          console.log("response abaixo");
          console.log(response);
          const panel = vscode.window.createWebviewPanel(
            "webview",
            "Search Problems",
            vscode.ViewColumn.Two,
            {}
          );

          panel.webview.html = `
              <html>
                <body>
                <h3>Search List</h3>
                <ul>
                ${(response.data.items as any[]).map((value) => {
                  return `<li><a href="${value.link}">${value.title}</a></li>`;
                })}
                </ul>
                </body>
              </html>
            `;
        });
    }
  }
}

export default Search;
