const { ipcMain } = require('electron');

module.exports = class IPC {
  constructor(context, handlers = null) {
    this.context = context;
    this.contextWindowTitle = 'Squareshoot';

    this.handlers = handlers;
  }

  register() {
    ipcMain.on('to:title:set', (event, title = null) => {
      if (title) {
        this.contextWindowTitle = `Squareshoot - ${title}`;
      }

      this.context.setTitle(this.contextWindowTitle);
    });
  }
}