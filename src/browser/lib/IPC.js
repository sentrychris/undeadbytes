export class IPC
{
  constructor (bridge, { register = false }) {
    this.bridge = bridge;
    
    this.handlers = {};
    
    if (register) {
      this.register();
    }
  }

  attach (handler, instance) {
    this.handlers[handler] = instance;
  }

  register () {
    // To be received throughg IPC channel from main context
    // TODO whitelist the channel
    this.bridge.receive('from:settings:set', (settings) => {
      console.log(settings);
    });
  }

  saveSettingsToFile (settings) {
    this.bridge.send('to:settings:save', {
      settings
    });
  }
}