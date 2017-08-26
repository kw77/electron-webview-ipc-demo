// This is the JS code that would be hosted remotely, running on the page in the
// web view. By default, this has *no* rights to the electron app. The safe
// approach is to use the preload script to setup a bridge between the main.js
// process and the web view JS code.

// In this setup, the renderer JS file doesn't really come into play. The preload
// JS file is treated as just another renderer and can talk directly back to the
// main process (i.e. it does *not* need to work through the rendered, it go
// go direct)

// In this example, communication is established two-way.


// This is a simple helper function to return true/false as an electron web view; 
// it is simply testing the presence of the global bridge between the web view
// and the main process (in this example, from the 'bridge' object we create as
// the link via the preload.js file)
window.isElectron = function() {
    return 'Bridge' in window;
};

// This is a simple function that, if running in electron, will trigger the
// sendMessage function that is exposed via the sendMessage bridge method
// when the corresponding send button is clicked
function send() {
    if(isElectron()) {
        // Note that the sendMessage function needs to be setup in the preload
        // script and ties to a corresponding main process method/function
        window.Bridge.sendMessage('Message from web view index.js');
    } else {
        console.log('Not electron; cannot access the Bridge')
    }
}
// Corresponding button event handler
document.getElementById('send').onclick = function(){ send() };


// For test purposes only, we are simply going to confirm in the GUI if we are
// running in a electron or native web context (based on the availablility of the
// window.bridge object)
if(isElectron()) {
    document.querySelector('#context').innerHTML = 'ELECTRON context';
} else {
    document.querySelector('#context').innerHTML = 'WEB context';
}


// The webview page doesn't have access to main ipc events, so the preload script
// is used to provide controlled access between the two. In this example, preload
// is configured to call window.Bridge.infoFromMain... the web view index.js
// (this) can then, if running in the electron context, register its own handlers
// for this.
if(isElectron()) {
    window.Bridge.infoFromMain = function(data){
        var timestamp = new Date();
        document.querySelector('#info').innerHTML = timestamp.toTimeString().substring(0,8) + ': ' + data.msg;
    };
}