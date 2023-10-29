const path = require('path');
const { app, Menu } = require('electron');
const openAboutWindow = require('about-window').default;


module.exports = class AppMenu {
  constructor(context, { register = false, handlers = { storage: null } }) {
    this.context = context;
    this.handlers = handlers;

    if (register) {
      this.register();
    }
  }

  attach (handler, instance) {
    this.handlers[handler] = instance;
  }

  register () {
    app.applicationMenu = Menu.buildFromTemplate([
      {
        label: 'Game',
        submenu: [
          {
            label: 'Load Game...',
            click: () => {
              this.handlers.storage.loadGameFromFile('20231029162414')
                .then((save) => {
                  this.context.webContents.send('from:game:save', save);
                });
            },
            accelerator: 'Ctrl+L'
          },
          {
            label: 'Save Game',
            accelerator: 'Ctrl+S'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
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