const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const IPC = require('./app/IPC');
const Menu = require('./app/Menu');
const Storage = require('./app/Storage');

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
    height: 1000,
    width: 1440,
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

  const storage = new Storage(context);

  new IPC(context, { storage }, {
    register: true
  });

  new Menu(context, {
    handlers: { storage },
    register: true
  });

  context.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return {
      action: 'deny'
    };
  });

  context.webContents.setZoomFactor(1.0);
  console.log(`zoom: ${context.webContents.getZoomFactor()}`);

  context.webContents.on('zoom-changed', (event, direction) => {
    const curr = context.webContents.getZoomFactor();
    console.log(`zoom: ${curr}`);

    let factor;
    if (direction === 'in') factor = (curr + 0.1);
    if (direction === 'out') factor = (curr - 0.1);

    if (factor < 0.1) factor = 0.1;
    if (factor > 1.0) factor = 1.0;

    context.webContents.zoomFactor = factor;

    console.log(
      `Zoom ${direction} to: `,
      context.webContents.zoomFactor * 100, "%"
    );
  });

  context.webContents.on('did-finish-load', () => {
    // When the app is loaded, settings are fetched from the
    // file and sent to the renderer context
    context.webContents.send(
      'from:settings:set',
      storage.loadSettingsFromFile()
    );
  });

  context.on('closed', () => {
    context = null;
  });

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