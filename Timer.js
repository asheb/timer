const { dialog } = require('electron');

class Timer {

  constructor(updateView) {
    this.updateView = updateView;

    this.started = false;
    this.intervalId = null;
    this.secondsToGo = 5; //20 * 60;
    this.secondsLeft = this.secondsToGo;
  }

  toggle() {
    if (!this.started) this.start();
    else this.pause();
  }

  start() {
    this.started = true;
    this.updateView();

    let startTime = Date.now();
    this.intervalId = setInterval(() => {
      const spent = Math.round((Date.now() - startTime) / 1000); // seconds
      this.secondsLeft = this.secondsToGo - spent;
      this.updateView();

      if (this.secondsLeft <= 0) {
        this.pause();
        dialog.showMessageBox({ message: "Time to take a break!", buttons: [] });
      }
    }, 1000);
  }

  pause() {
    this.started = false;
    this.secondsToGo = this.secondsLeft;
    clearInterval(this.intervalId);
    this.updateView();
  }

}


module.exports = Timer;

