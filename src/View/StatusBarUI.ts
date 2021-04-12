import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export class StatusBarUI {
  private static statusBarItem: StatusBarItem;

  public static get statusBar() {
    StatusBarUI.statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      100
    );
    StatusBarUI.statusBarItem.text = "Search Question";
    StatusBarUI.statusBarItem.command = "extension-teste.getResult";

    StatusBarUI.statusBarItem.show();

    return this.statusBarItem;
  }
}
