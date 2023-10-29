import { Dispatcher } from './Dispatcher';

export class GameDispatcher extends Dispatcher {
  message ({ message }) {
    this.dispatchEvent({
      type: 'message',
      message
    });
  }
  
  loadGame ({ save }) {
    console.log('dispatching load game event');
    this.dispatchEvent({
      type: 'game:load',
      save
    });
  }
}
