const { ipcMain } = require('electron');

module.exports = class IPC {
  constructor(context, handlers = null) {
    this.context = context;
    this.contextWindowTitle = 'Undead Bytes';

    this.handlers = handlers;
  }

  register() {
    ipcMain.on('to:title:set', (event, title = null) => {
      if (title) {
        this.contextWindowTitle = `Undead Bytes - ${title}`;
      }

      this.context.setTitle(this.contextWindowTitle);
    });
  }
}