const { app, BrowserWindow, nativeTheme: { shouldUseDarkColors }, shell} = require('electron');
const path = require('path');
const IPC = require('./app/ipc');
const Menu = require('./app/menu');

let context;
function main() {
  context = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  context.webContents.on('will-navigate', (event) => event.preventDefault());
  context.loadFile(path.join(__dirname, '../dist/index.html'));

  const ipc = new IPC(context, null);
  ipc.register();

  const menu = new Menu(context);
  menu.register();

  context.webContents.on('did-finish-load', () => {
    console.log('finished loading');
  });

  context.on('closed', () => {
    context = null;
  });

  context.maximize();
  context.show();
}

app.on('ready', () => {
  main();
});

app.on('activate', () => {
  if (! context) {
    main();
  }
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event) => {
    app.focus();
  });
}

app.on('window-all-closed', () => {
  app.quit();
})