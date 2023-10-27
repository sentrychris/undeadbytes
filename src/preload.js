const { contextBridge, ipcRenderer } = require('electron');

const contextBridgeChannel = () => {
  return {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel, fn) => {
      ipcRenderer.on(channel, (event, ...args) => {
        fn(...args);
      });
    }
  }
}

contextBridge.exposeInMainWorld('executionBridge', contextBridgeChannel());