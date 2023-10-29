import { Game } from './lib/Game';
import { trackWASD, logGameStateToConsole, isActiveElement } from './util';

// Styles
import './css/main.css';
import { IPC } from './lib/IPC';
import { Settings } from './lib/Settings';

const viewport = document.querySelector('#undead-bytes');
const splash = document.querySelector('.splash');
const canvas = document.querySelector('canvas#game');

function hasExecutionBridge () {
  return Object.prototype.hasOwnProperty.call(window, 'executionBridge')
    && window.executionBridge !== null;
}

function main () {
  if (isActiveElement(viewport) && canvas) {
    // Create a new game
    const game = new Game(canvas.getContext('2d'));

    const bridge = hasExecutionBridge() ? 'node' : 'web';
    game.attach('settings', new Settings(bridge, game, {
      settings: null,
      register: false
    }));
    
    // Setup the level and start the game loop
    game.setup({ level: 1 }, true);
    
    // Track WASD for UI
    trackWASD();

    // Track game state in the console
    logGameStateToConsole(game, 10000);

    // If running within electron app, register IPC for communication
    // between the main and renderer execution contexts.
    if (hasExecutionBridge()) {
      // The bi-directional bridge to the main execution context
      // exposed on the window object through the pre-loader
      const bridge = window.executionBridge;

      // Create a new IPC handler for the web execution context
      // with a bridge to the main execution context
      const ipc = new IPC(game, bridge, true);

      // Attach web settings handler to the IPC handler
      ipc.attach('settings', /* settings handler */);

      // Attach IPC handler to the managed game.
      game.attach('ipc', ipc);
    }
  }
}

document.querySelector('#play-now').addEventListener('click', () => {
  if (splash) {
    document.body.classList.remove('body-splash');
    splash.style.display = 'none';
    viewport.classList.remove('inactive');
  }

  main();
});