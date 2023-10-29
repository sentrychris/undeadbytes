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

function createIPCHandler (game) {
  // The bi-directional bridge to the main execution context
  // exposed on the window object through the pre-loader
  const bridge = window.executionBridge;

  // Create a new IPC handler for the web execution context
  // with a bridge to the main execution context
  const ipc = new IPC(bridge, {
    register: true
  });

  if (game.handlers.settings) {
    // If the game has an instantiated settings handler
    // then attach it to the IPC handler
    ipc.attach('settings', game.handlers.settings);
  }

  return ipc;
}

function main () {
  // Check which context the game is running in
  const bridge = hasExecutionBridge() ? 'node' : 'web';

  if (isActiveElement(viewport) && canvas) {
    // Create a new managed game
    const game = new Game(canvas.getContext('2d'));

    // Attach a new settings handler to the managed game
    game.attach('settings', new Settings(bridge, {
      settings: null,
      register: true
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
      const ipc = createIPCHandler(game);

      // Attach IPC handler to the managed game.
      game.attach('ipc', ipc);
    }
  }
}

/**
 * Spash screen play trigger
 */
document.querySelector('#play-now').addEventListener('click', () => {
  if (splash) {
    document.body.classList.remove('body-splash');
    splash.style.display = 'none';
    viewport.classList.remove('inactive');
  }

  main();
});