// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron');

const selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', function (event) {
  ipcRenderer.send('open-file-dialog',[]);
})

ipcRenderer.on('selected-directory', function (event, data) {
  document.getElementById('markDownData').innerText = data;
})