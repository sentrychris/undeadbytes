import { Dispatcher } from './Dispatcher';

export class GameDispatcher extends Dispatcher {
  message ({ message }) {
    this.dispatchEvent({
      type: 'message',
      message
    });
  }
  
  loadGame ({ save }) {
    this.dispatchEvent({
      type: 'game:load',
      save
    });
  }
}
