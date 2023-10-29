export class IPC
{
  constructor (game, bridge, register = false) {
    this.game = game;
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
    this.bridge.receive('from:settigs:set', (settings) => {
      // this.handlers.settings.load
    });
  }
}