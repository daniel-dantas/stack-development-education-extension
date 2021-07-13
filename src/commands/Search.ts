import * as vscode from "vscode";
import { Terminal, window } from "vscode";
import api from "../service/api";
import { NodeDependenciesProvider } from "./NodeDependenciesProvider";

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

      // .get(
      //   `https://api.stackexchange.com/2.2/search/advanced?pagesize=100&order=desc&tagged=${dependenciesFilter.join(
      //     ";"
      //   )}&sort=activity&q=${value}&site=stackoverflow`
      // )

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

        panel.webview.html = `
        <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Posts</title>
    <style>

        * {
            margin: 0;
            padding: 0;
        }

        .content {
            background-color: #172D4E; 
            width: 100%;
            height: 100%;
            margin: 0;
        }


        .content .header-search {
            height: 80px;
            /* background-color: red; */

            display: flex;
            justify-content: center;
            align-items: center;
        }

        .content .header-search input {
            width: 90%;
            height: 30px;

            padding: 0 10px;
            border: 1px solid gray;
            border-radius: 5px;
        }

        .content .body-search{
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
        }

        .content .body-search .item-post{
            width: 90%;
            display: flex;
            height: 100px;
            background-color: #1D4176;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        
        .body-search .item-post .score {

            width: 120px;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            background-color: #5B6E89;
            color: #fff;
            border-radius: 5px;
        }

        .body-search .item-post .content-info {
            width: 100%;
            color: #fff;
            border-radius: 10px;

            display: flex;
            flex-direction: column;
            justify-content: center;

            padding: 0 20px;
        }

        .body-search .item-post .content-info h3 {
            cursor: pointer;
        }

        .body-search .item-post .content-info span {
            margin-top: 5px;
        }

    </style>
</head>
<body>
    <div class="content">
        <div class="header-search">
            <input type="text" placeholder="Search">
        </div>
        <div class="body-search">
              ${(response.data.data as any[]).map((value) => {
                return `
                <div class="item-post">
                <div class="score">
                    <span><b>${value.score}</b></span>
                    <span>Score</span>
                </div>
                <div class="content-info">
                    <h3>${value.title}</h3>
                    <span>${(value.tags as string[])}</span>
                </div>
            </div>
                `;
              })}
              </div>
    </div>
</body>
</html>
          `;

    }
  }
}

export default Search;
