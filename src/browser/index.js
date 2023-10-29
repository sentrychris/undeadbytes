import { Game } from './lib/Game';
import { Settings } from './lib/Settings';
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

// Load game settings
const settings = new Settings(bridge, {
  register: true
});

// Game setup
function main () {
  if (isActiveElement(viewport) && canvas) {
    // Create a new managed game instance
    const game = new Game(bridge, canvas.getContext('2d'));

    // Attach settings to the game instance
    game.attach('settings', settings);
    
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