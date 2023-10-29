const { contextBridge, ipcRenderer } = require('electron');

const senderWhitelist = [
  'to:title:set',
  'to:settings:save',
  'to:game:save'
];

const receiverWhitelist = [
  'from:settings:set'
];

const contextBridgeChannel = () => {
  return {
    send: (channel, data) => {
      if (senderWhitelist.includes(channel)) {
        // Send an async message to te main process via whitelisted channel.
        //
        // Note, arguments will be serialized with the structured clone algorithm,
        // so prototype chains will not be included. Sending functions, promises,
        // symbols, weakmaps, weaksets or DOM objects will throw an exception.
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, fn) => {
      if (receiverWhitelist.includes(channel)) {
        // Execute callback on message received through whitelisted channel.
        ipcRenderer.on(channel, (event, ...args) => {
          fn(...args);
        });
      }
    }
  }
}

contextBridge.exposeInMainWorld('executionBridge', contextBridgeChannel());