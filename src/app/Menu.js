const path = require('path');
const { app, Menu } = require('electron');
const openAboutWindow = require('about-window').default;

/**
 * App Menu.
 * @class
 * @category Desktop App
 */
class AppMenu
{
  /**
   * Create new desktop app menu.
   * 
   * @constructor
   * @param {BrowserWindow} context - the electron browser window
   * @param {Object} params
   * @param {boolean} params.register - immediately register the menu or defer
   * @param {Object} params.handlers - game handlers to attach e.g. storage
   */
  constructor(context, { register = false, handlers = { storage: null } }) {
    this.context = context;
    this.handlers = handlers;

    if (register) {
      this.register();
    }
  }

  /**
   * Attach handlers for the menu for callback behaviour
   * 
   * @param {string} handler - the handler key
   * @param {Object} instance - the handler instance
   * 
   * @returns {void}
   */
  attach (handler, instance) {
    this.handlers[handler] = instance;
  }

  /**
   * Register the application menu
   * 
   * @returns {void}
   */
  register () {
    app.applicationMenu = Menu.buildFromTemplate([
      {
        label: 'Game',
        submenu: [
          {
            label: 'Load Game...',
            click: () => {
              this.handlers.storage.loadGameFromFile()
                .then((save) => {
                  this.context.webContents.send('from:game:save', save);
                });
            },
            accelerator: 'Ctrl+L'
          },
          {
            label: 'Save Game',
            click: () => {
              // will need to make a round trip into the web context to get the settings values
            },
            accelerator: 'Ctrl+S'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Zoom In',
            accelerator: (function() {
              return process.platform === 'darwin' ? 'Command+Plus' : 'Ctrl+Plus'
            }()),
            click: () => {
              const factor = (this.context.webContents.getZoomFactor() + 0.1)
              this.context.webContents.zoomFactor = factor > 1 ? 1 : factor;
            }
          },
          {
            label: 'Zoom Out',
            accelerator: (function() {
              return process.platform === 'darwin' ? 'Command+-' : 'Ctrl+-'
            }()),
            click: () => {
              const factor = (this.context.webContents.getZoomFactor() - 0.1)
              this.context.webContents.zoomFactor = factor < 0.1 ? 0.1 : factor;
            }
          },
          { type: 'separator' },
          {
            label: 'Toggle Developer Tools',
            accelerator: (function () {
              return process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I';
            }()),
            click: () => {
              this.context.webContents.toggleDevTools();
            }
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About...',
            click: () => {
              openAboutWindow({
                icon_path: path.join(__dirname, '../shared/assets/logo.ico'),
                product_name: 'Undead Bytes',
                copyright: '© 2023 - ' + new Date().getFullYear() + ' Chris Rowles. All rights reserved.',
                package_json_dir: path.join(__dirname, '../../'),
                use_version_info: true,
                bug_report_url: 'https://github.com/sentrychris/undeadbytes.git'
              });
            }
          }
        ]
      }
    ]);
  }
};

module.exports = AppMenu;