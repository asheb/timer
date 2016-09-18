const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');

let win, tray;

function createWindow() {
  win = new BrowserWindow({ show: false });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => { win = null; });
}

function createTrayIcon() {
  win.webContents.executeJavaScript('makeImage()', false, (dataURL) => {
    tray = new Tray(nativeImage.createFromDataURL(dataURL));

    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'exit', click() { app.quit() } }
    ]));  

    tray.on('click', () => timer.toggle());
  })
}

app.on('ready', () => { createWindow(); createTrayIcon() });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });



/////////////////////////////////




function updateIcon() {
  let json = JSON.stringify(timer);
  win.webContents.executeJavaScript(`makeImage(${json})`, false, (dataURL) => {
    tray.setImage(nativeImage.createFromDataURL(dataURL));
  });
}



class Timer {

  constructor() {
    this.started = false;
    this.intervalId = null;
    this.secondsToGo = 20 * 60;
    this.secondsLeft = this.secondsToGo;
  }

  toggle() {
    if (!this.started) this.start();
    else this.pause();
  }

  start() {
    this.started = true;
    updateIcon();

    let startTime = Date.now();
    this.intervalId = setInterval(() => {
      const spent = Math.round((Date.now() - startTime) / 1000); // seconds
      this.secondsLeft = this.secondsToGo - spent;
      updateIcon();
    }, 1000);
  }

  pause() {
    this.started = false;
    clearInterval(this.intervalId);
    updateIcon();
  }

}

let timer = new Timer();









