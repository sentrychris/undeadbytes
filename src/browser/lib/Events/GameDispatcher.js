import { Dispatcher } from './Dispatcher';

/**
 * Game event dispatcher.
 * @class
 * @category Events
 */
export class GameDispatcher extends Dispatcher
{
  
  /**
   * Dispatch custom message.
   * 
   * @param {string} message - the message to send
   * @returns {void} 
   */
  message ({ message }) {
    this.dispatchEvent({
      type: 'message',
      message
    });
  }
  
  /**
   * Dispatch load game event.
   * 
   * @param {Object} params
   * @param {*} params.save - the save file json object
   * @param {boolean} params.instantiate - whether or not the game has already been instantiated past the splash screen
   * @returns {void}
   */
  loadGame ({ save, instantiate = false }) {
    const type = instantiate ? 'game:load:instance' : 'game:load';
    this.dispatchEvent({
      type,
      save,
      instantiate
    });
  }
}
