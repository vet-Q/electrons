// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const electronLocalshortcut = require('electron-localshortcut')
const crawler = require('./medicrawler');

// app.disableHardwareAcceleration()
let mainWindow;

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      nodeIntegration:false,
    }
  })
  electronLocalshortcut.register(mainWindow,'F5',()=>{
    console.log('F5 is pressed')
    mainWindow.reload()
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setProgressBar(0.5)
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on("toMain", async(event, data) => {
try{
  console.log(`Received [${data}] from renderer browser`);
  await crawler.writefiles('CHANG');
  await event.reply('fromMain', 'Crawling is over');
}catch{
  (err)=>{throw err}
}
});

ipcMain.on("openWindow", async(event, data) => {
  try{
    await openNewWindow()
    console.log(event);
  }catch{
    (err)=>{throw err}
  }
  });
  

const openNewWindow = () => {
  var win = new BrowserWindow({
      width: 1024,
      height: 768,
      show: true,
      webPreferences: {
          nodeIntegration: false,
          webSecurity: true,
          allowEval: false,
          nativeWindowOpen: true,
          allowRunningInsecureContent: false,
          contextIsolation: true,
          enableRemoteModule: true,
          // preload: path.join(__dirname, "preload.js")
      },
      autoHideMenuBar: true,
  });
  win.loadFile('test.html')
  win.webContents.openDevTools()
};
