const { app } = require('electron');

const remote = require('electron').remote;
var window = remote.getCurrentWindow();

document.getElementById("closeBtn").addEventListener("click", closeFunc)
{
     window.close();
     app.exit(0);
     process.exit;
} 