const { app, BrowserWindow, nativeTheme: { shouldUseDarkColors }, shell} = require('electron');
const path = require('path');
const IPC = require('./app/ipc');
const Menu = require('./app/menu');

// Rendering Modes

// GPU accelerated
// GPU accelerated rendering means that the GPU is used for composition. Because of that, the frame
// has to be copied from the GPU which requires more resources, thus this mode is slower than the
// Software output device. The benefit of this mode is that WebGL and 3D CSS animations are supported.

// Software output device
// This mode uses a software output device for rendering in the CPU, so the frame generation is much
// faster. As a result, this mode is preferred over the GPU accelerated one.
// app.disableHardwareAcceleration();

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
  context.webContents.setFrameRate(60);

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