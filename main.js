// This is the main electron process; the heart of each electron app
const { app, BrowserWindow, webContents } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // And load the local index.html page (note that, in this example, this is the
  // main electron web page... which contains the web view wrapper to the remote
  // page)
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
  // Use path.join to handle cross platform forward/back slash differences

  // Emitted when the renderer window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  setTimeout(infoToWebview,3000);
}

// This method will be called when Electron has finished initialisation and is
// ready to create browser windows. Some APIs can only be used after this event
// occurs.
app.on('ready', createWindow);

// RECEIVE FROM WEB VIEW
// ---------------------
// Create a function which will be triggerable from the web view window (linked
// via the Bridge object setup by the web view preload script)
global.receiveMessage = function(text) {
  console.log('Message: ' + text);
}

// SEND TO WEB VIEW
// ----------------
// Send a message to the web view. The main process has access to all web
// instances (webContents). To send the message to just the remote webview,
// we need to loop through all instances to identify the one in question.
// You only get access to it index in the webcontents array (unreliable),
// page title (depdent on the foreign/remote web page configuraiton) or,
// as below, a custom user agent string that is in our control.
// The preload script for the webview then needs to register an ipc event
// listener for the 'info' channel message sent (and allow this to be bound
// to a function in the actual web view js code)
function infoToWebview(){
  console.log('Message: Sending message from main process to webview...');

  var webContentInstances = webContents.getAllWebContents()

  for(var i = 0; i < webContentInstances.length; i++){
    if(webContentInstances[i].getUserAgent() == 'electron-webview'){
      webContentInstances[1].send('info', {msg:'msg from MAIN process'})
    }
  }
}
