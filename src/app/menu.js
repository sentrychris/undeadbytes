const path = require('path');
const { app, Menu } = require('electron');
const openAboutWindow = require('about-window').default;

module.exports = class AppMenu {
  constructor(context, register = false) {
    this.context = context;

    if (register) {}
  }

  register () {
    app.applicationMenu = Menu.buildFromTemplate([
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
                product_name: 'Squareshoot',
                copyright: '© 2023 - ' + new Date().getFullYear() + ' Chris Rowles. All rights reserved.',
                package_json_dir: path.join(__dirname, '../../'),
                use_version_info: true,
                bug_report_url: 'https://github.com/sentrychris/squareshoot.git'
              });
            }
          }
        ]
      }
    ]);
  }
};

