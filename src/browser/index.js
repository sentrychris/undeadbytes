import { Game } from './lib/Game';
import { Storage } from './lib/Storage';
import { GameDispatcher } from './lib/Events/GameDispatcher';
import {
  isActiveElement,
  getExecutionBridge,
  trackWASDKeyboard,
  logGameStateToConsole,
} from './util';

// Styles
import './css/main.css';

const viewport = document.querySelector('#undead-bytes');
const splash = document.querySelector('.splash');
const canvas = document.querySelector('canvas#game');

// Determines whether or not game is running within browser or electron app
const bridge = getExecutionBridge();

// Create a game dispatcher for dispatching handler events
const dispatcher = new GameDispatcher();

// Load storage (settings, saved games etc.)
const storage = new Storage(bridge, dispatcher, {
  register: true
});

// Game setup
function main () {
  if (isActiveElement(viewport) && canvas) {
    // Create a new managed game instance
    const game = new Game(bridge, dispatcher, canvas.getContext('2d'));

    // Attach storage to the game instance
    game.attach('storage', storage);
    
    // Setup the level and start the game loop
    game.setup({ level: 1 }, true);

    // Track WASD for UI
    trackWASDKeyboard();

    // Track game state in the console
    logGameStateToConsole(game, 10000);
  }
}

// Spash screen play trigger
document.querySelector('#play-now').addEventListener('click', () => {
  if (splash) {
    document.body.classList.remove('body-splash');
    splash.style.display = 'none';
    viewport.classList.remove('inactive');
  }

  main();
});

document.querySelector('#load-game').addEventListener('click', () => {
  if (bridge !== 'web') {
    bridge.send('to:game:load');
  }
});