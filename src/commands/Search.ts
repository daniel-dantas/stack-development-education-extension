import * as vscode from "vscode";
import { Terminal, window } from "vscode";
import api from "../service/api";
import { NodeDependenciesProvider } from "./NodeDependenciesProvider";
import axios from "axios";
import * as fs from "fs";
import { resolve } from "path";
import * as handlebars from "handlebars";
class Search {

  private static teste() {
    console.log("teste");
  }  

  private static navigatePanel (panel1: vscode.WebviewPanel, panel2: vscode.WebviewPanel) {
    panel1.dispose();
  }
  
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
      const response = await api
        .post("/search", {
          search: value,
          tags: dependenciesFilter
        });

        console.log("response abaixo");
        console.log(response);
        const panel = vscode.window.createWebviewPanel(
          "webview",
          "Search Problems",
          vscode.ViewColumn.Two,
          {}
        );
        
        (response.data.data as any[]).sort((post1, post2) => post2.score - post1.score);

        const templateFileContent = fs
				.readFileSync(
          resolve(
            __dirname,
            "..",
            "..",
            "src",
            "View",
            "templates",
            "SearchResult.template.hbs"
          )
				)
				.toString("utf8");
        
        handlebars.registerHelper("teste_function", () => {
          return () => {
            panel.dispose();
          };
        });

        const viewTemplate = handlebars.compile(templateFileContent);
        const html = viewTemplate({
          data: response.data.data,
        });

        panel.webview.html = html;
    }
  }
}

export default Search;
