const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// Global reference of main window
let win;

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({icon: path.join(__dirname, 'icons/png/64x64.png')});
  // Load index.html in the window
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file',
    slashes: true
  }));

  // Delete the window object when close
  win.on('closed', () => {
    win = null;
  });
}

// Run the app
app.on('ready', createWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
