// This file runs in the context of the main 'browserWindow' that is launched
// by the main process. For local Electron apps (where the HTML, logic, etc)
// is local to the client it is running on, this would be the initial launch
// file for the electron app.
//
// In this instance, the primary renderer page simply houses a web view
// to a remote resource. This is useful for when you want the app to reside
// centrally for frequent update / change purposes.
//
// The web view approach does, however, need additional measures to be taken
// to allow the web view to be empowered with local EXE rights (so only controlled
// actions can be invoked from the remote page for security purposes).



// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// Viewing thew dev tools console using the electron app shows the console for
// the renderer... not the nested web view, as such, the following approach can be
// taken to invoke access to the embedded web view's console.

var webview = document.getElementById("mainwebview");

webview.addEventListener("dom-ready", function(){ webview.openDevTools(); });
