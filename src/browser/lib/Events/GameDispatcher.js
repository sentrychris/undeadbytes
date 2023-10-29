import { Dispatcher } from './Dispatcher';

export class GameDispatcher extends Dispatcher {
  message ({ message }) {
    this.dispatchEvent({
      type: 'message',
      message
    });
  }
  
  loadGame ({ save, instantiate = false }) {
    const type = instantiate ? 'game:load:instance' : 'game:load';
    this.dispatchEvent({
      type,
      save,
      instantiate
    });
  }
}
