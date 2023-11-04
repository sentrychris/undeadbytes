const { ipcMain } = require('electron');


/**
 * IPC Handler.
 * @class
 * @category Desktop App
 */
class IPC
{
  /**
   * Create a new IPC handler instance.
   * 
   * @param {BrowserWindow} context - the electron browser window
   * @param {Object} handlers - game handlers to attach e.g. storage 
   * @param {Object} params
   * @param {boolean} params.register - immediately register event listeners or defer
   */
  constructor(context, handlers = { storage: null }, { register = false}) {
    this.context = context;
    this.contextWindowTitle = 'Undead Bytes';

    this.handlers = handlers;

    if (register) {
      this.register();
    }
  }

  /**
   * Register IPC event listeners.
   * 
   * @returns {void}
   */
  register() {
    ipcMain.on('to:title:set', (event, title = null) => {
      if (title) {
        this.contextWindowTitle = `Undead Bytes - ${title}`;
      }

      this.context.setTitle(this.contextWindowTitle);
    });

    ipcMain.on('to:settings:save', (event, { settings }) => {
      this.handlers.storage.saveSettingsToFile(settings);
    });

    ipcMain.on('to:game:save', (event, { save }) => {
      this.handlers.storage.saveGameToFile(save);
    });

    ipcMain.on('to:game:load', (event) => {
      this.handlers.storage.loadGameFromFile()
        .then((save) => {
          this.context.webContents.send('from:game:save', save);
        });
    });
  }
}

module.exports = IPC;