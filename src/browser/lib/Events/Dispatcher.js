/**
 * Dispatcher base class
 * @class
 * @category Events
 */
export class Dispatcher {
  _listeners = {};
  
  /**
   * Add event listener for custom event dispatchers.
   * 
   * @param {string} type - the type of event
   * @param {function} listener - the listener callback
   * @returns {void}
   */
  addEventListener (type, listener) {
    if (this._listeners === undefined) this._listeners = {};
    const listeners = this._listeners;
    
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }
    
    if (!listeners[type].includes(listener)) {
      listeners[type].push(listener);
    }
  }
  
  /**
   * Check to see if listener exists.
   * 
   * @param {string} type - the type of event
   * @param {function} listener - the listener callback
   * @returns {boolean}
   */
  hasEventListener (type, listener) {
    if (this._listeners === undefined) return false;
    const listeners = this._listeners;
    
    return listeners[type] !== undefined && listeners[type].includes(listener);
  }
  
  /**
   * Remove event listener.
   * 
   * @param {string} type - the type of event
   * @param {function} listener - the listener callback
   * @returns {void}
   */
  removeEventListener (type, listener) {
    if (this._listeners === undefined) return;
    const listeners = this._listeners;
    const listenerA = listeners[type];
    
    if (listenerA !== undefined) {
      const index = listenerA.indexOf(listener);
      if (index !== -1) {
        listenerA.splice(index, 1);
      }
    }
  }
  
  /**
   * Dispatch custom event.
   * 
   * @param {Object} event 
   * @returns {void}
   */
  dispatchEvent (event) {
    if (this._listeners === undefined) return;
    const listeners = this._listeners;
    const listenerA = listeners[event.type];
    
    if (listenerA !== undefined) {
      event.target = this;
      
      const copy = listenerA.slice(0);
      
      for (let i = 0, j = copy.length; i < j; ++i) {
        copy[i].call(this, event);
      }
    }
  }
}
