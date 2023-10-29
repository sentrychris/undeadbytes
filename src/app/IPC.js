const { ipcMain } = require('electron');


module.exports = class IPC
{
  constructor(context, handlers = { settings: null }, { register = false}) {
    this.context = context;
    this.contextWindowTitle = 'Undead Bytes';

    this.handlers = handlers;

    if (register) {
      this.register();
    }
  }

  register() {
    ipcMain.on('to:title:set', (event, title = null) => {
      if (title) {
        this.contextWindowTitle = `Undead Bytes - ${title}`;
      }

      this.context.setTitle(this.contextWindowTitle);
    });

    ipcMain.on('to:settings:save', (event, { settings }) => {
      // call method belonging to app context Settings handler
      this.handlers.settings.saveToFile(settings);
    });
  }
}