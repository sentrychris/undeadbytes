import { Manager } from './lib/Manager';
import { trackWASD, logGameStateToConsole } from './util';

// Styles
import './css/main.css';

// Create a new game manager
const manager = new Manager(
  document.querySelector('canvas#main').getContext('2d')
);

// Setup a new game and start the game loop
manager.setup({ level: 1 }, true);

// Track WASD for UI
trackWASD();

// Track game state in the console
logGameStateToConsole(manager, 3000);