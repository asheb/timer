const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');

let win, tray;

function createWindow() {
  win = new BrowserWindow({ show: false });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => { win = null; });
}




function createTrayIcon() {

  win.webContents.executeJavaScript('makeImage(0)', false, (dataURL) => {
    tray = new Tray(nativeImage.createFromDataURL(dataURL));

    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'exit', click() { app.quit() } }
    ]));  

    tray.on('click', () => {
      startTimer(); //> toggle timer instead
    });
  })

}

app.on('ready', () => { createWindow(); createTrayIcon() });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });



/////////////////////////////////


function updateIcon(value) {
  win.webContents.executeJavaScript(`makeImage(${value})`, false, (dataURL) => {
    tray.setImage(nativeImage.createFromDataURL(dataURL));
  });
}

function startTimer() {
  console.log('ok');
  let startTime = Date.now();
  let secondsToGo = 20 * 60;
  setInterval(() => {
    const spent = Math.round((Date.now() - startTime) / 1000); // seconds
    const left = secondsToGo - spent;
    console.log(left);
    updateIcon(left);
  }, 1000);


}






