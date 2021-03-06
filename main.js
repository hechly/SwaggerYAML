// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { parse, convert } = require('odata2openapi');
const YAML = require('json-to-pretty-yaml');



function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  //mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
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

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile'], filters: [
      { name: 'XML', extensions: ['xml'] },
    ]
  }).then((result) => {

    if (!result.canceled) {
      try {
        fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          parse(data)
            .then(service => convert(service.entitySets, {}, service.version))
            .then((swagger) => {
              console.log(swagger)
              const data = YAML.stringify(swagger);
              event.sender.send('selected-directory', data);
              
            }
            )
            .catch(error => console.error(error))
        })
      } catch (err) {
        console.error(err)
      }
    }
  })
})