import { Game } from './lib/Game';
import { trackWASD, logGameStateToConsole } from './util';

// Styles
import './css/main.css';

// Create a new game
const game = new Game(
  document.querySelector('canvas#main').getContext('2d')
);

// Setup the level and start the game loop
game.setup({ level: 0 }, true);

// Track WASD for UI
trackWASD();

// Track game state in the console
logGameStateToConsole(game, 3000);