const { app, BrowserWindow, shell} = require('electron');
const path = require('path');
const IPC = require('./app/IPC');
const Menu = require('./app/Menu');
const Settings = require('./app/Settings');

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
    icon: path.join(__dirname, 'shared/assets/logo.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  context.webContents.on('will-navigate', (event) => event.preventDefault());
  context.loadFile(path.join(__dirname, '../dist/index.html'));
  context.webContents.setFrameRate(60);

  const settings = new Settings(context);

  new IPC(context, { settings }, {
    register: true
  });

  new Menu(context, {
    register: true
  });

  context.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return {
      action: 'deny'
    };
  });

  context.webContents.on('did-finish-load', () => {
    // When the app is loaded, settings are fetched from the
    // file and sent to the renderer context
    context.webContents.send(
      'from:settings:set',
      settings.loadFromFile()
    );
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