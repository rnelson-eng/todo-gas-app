function onOpen() {
  SpreadsheetApp.getUi().createMenu("To-Do App")
    .addItem("Open Dashboard", "showUI")
    .addToUi();
}

function showUI() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'To-Do Dashboard');
}
