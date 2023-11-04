/**
 * Game entry point.
 * 
 * @category Game
 * @memberof Game
 * @module entry
 */
import { Game } from './lib/Game';
import { Storage } from './lib/Storage';
import { GameDispatcher } from './lib/Events/GameDispatcher';
import { config } from './config';
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

// Set the build version
document.querySelector('.build-version span').innerHTML = config.version;

/**
 * Instantiate and begin a new game.
 * 
 * @param {number} level - the level to play
 * 
 * @returns {void}
 */
function main (level = 1) {
  if (isActiveElement(viewport) && canvas) {
    // Create a new managed game instance
    const game = new Game(bridge, dispatcher, canvas.getContext('2d'));

    // Attach storage to the game instance
    game.attach('storage', storage);
    
    // Setup the level and start the game loop
    game.setup({ level }, true);

    // Track WASD for UI
    trackWASDKeyboard();

    // Track game state in the console
    logGameStateToConsole(game, 10000);
  }
}

/**
 * Handle game instantiation from the splash screen.
 * 
 * @param {number} level - the level to play
 * 
 * @returns {void}
 */
function play (level = 1) {
  if (splash) {
    document.body.classList.remove('body-splash');
    splash.style.display = 'none';
    viewport.classList.remove('inactive');
  }

  main(level);
}

// Spash screen play trigger
document.querySelector('#play-now').addEventListener('click', () => {
  play();
});

// Load saved games trigger
document.querySelector('#load-game').addEventListener('click', () => {
  if (bridge !== 'web') {
    // Send event through IPC channel to load games from game directory
    bridge.send('to:game:load');
  } else {
    // Otherwise load games from local storage and configure display
    const loader = document.querySelector('#load-game-web');
    if (loader) {
      storage.loadGameSavesFromLocalStorage(loader);
    }
  }
});

// Event listener to instantiate a new game
dispatcher.addEventListener('game:load:instance', (event) => {
  const { save } = event;
  if (save) {
    play(save.level);
  }
});