const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const Timer = require('./Timer');

let win, tray;
let timer = new Timer(updateIcon);

function createWindow() {
  win = new BrowserWindow({ show: false });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => { win = null; });
}

function createTrayIcon() {
  win.webContents.executeJavaScript('makeImage()', false, (dataURL) => {
    tray = new Tray(nativeImage.createFromDataURL(dataURL));

    tray.setContextMenu(Menu.buildFromTemplate([
      // { label: '5 sec',  click() { timer.start(5 / 60) } },
      // { label: '30 sec', click() { timer.start(.5) } },
      // { label: '1 min',  click() { timer.start(1)  } },
      { label: '5 min',  click() { timer.start(5)  } },
      { label: '10 min', click() { timer.start(10) } },
      { label: '15 min', click() { timer.start(15) } },
      { label: '20 min', click() { timer.start(20) } },
      { label: 'exit', click() { app.quit() } }
    ]));

    tray.on('click', () => timer.toggle());
    tray.on('double-click', () => timer.start(20));
  })
}

function updateIcon() {
  let json = JSON.stringify({ secondsLeft: timer.secondsLeft, started: timer.started });
  win.webContents.executeJavaScript(`makeImage(${json})`, false, (dataURL) => {
    tray.setImage(nativeImage.createFromDataURL(dataURL));
  });
}

function registerShortcuts() {
  globalShortcut.register("Super+Y", () => timer.toggle());
  globalShortcut.register("Super+Shift+Y", () => timer.start(20));
}

app.on('ready', () => { createWindow(); createTrayIcon(); registerShortcuts(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });

