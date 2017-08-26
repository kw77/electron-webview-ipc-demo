// The preload script, has access to node.js and electron APIs. It runs in
// the context of the web view... but *prior* to the page being loaded.

// Its role is to expose links to the main process to be accessible from the
// web view (as needed). This should be done carefully.

// Once this is finished bring processed, the web view page will load... but JS
// code therein will *not* be allowed to access the node.js and electron APIs
// directly. The preload needs to 'leave behind' a global handle to talk to the
// main process

// Note that the preload script *can* talk directly with the main process, it is
// treated as just another renderer and does *not* need to talk through its direct
// parent rendered page/process

// Create handles to the electron ipcRenderer (alias: ipc) and 'remote' APIs
const { ipcRenderer: ipc, remote } = require('electron');

// 'remote' is an ipcRenderer wrapper for simplifying sending *to* the main process
// The ipcRenderer is used for receiving message *from* the main process

// Create some explicit handles to the main process global function in question
let receiveMessage = remote.getGlobal('receiveMessage');


function init() {
  // Call the function to listen to main process inbound event messages
  attachIPCListeners();

  // Expose a bridging API via a window global 'Bridge', providing explicit
  // functions to the remote web apps own JS code.
  
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC)
  // or node.js modules.
  window.Bridge = {
    sendMessage
  };
}


// Function referenced via the Bridge ob
function sendMessage(message) {
    receiveMessage(message);
}


// The preload has access to ipc (the actual webview page does not).
// Create a persistent event listener which will call a Bridge function
// which the webview page will need to add / own to receive content inbound
// from the main process
function attachIPCListeners() {
  // ipc event sent via the main process to the webview webcontent context
  ipc.on('info', (event, data) => {
    window.Bridge.infoFromMain(data);
  });
}

init();