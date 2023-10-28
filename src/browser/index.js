import { Game } from './lib/Game';
import { trackWASD, logGameStateToConsole } from './util';

// Styles
import './css/main.css';

const splash = document.querySelector('.splash-wrapper');
const wrapper = document.querySelector('#game-wrapper');
const canvas = document.querySelector('#game');

function main () {
  if (! wrapper.classList.contains('inactive') && canvas) {
    // Create a new game
    const game = new Game(canvas.getContext('2d'));
    // Setup the level and start the game loop
    game.setup({ level: 1 }, true);
    // Track WASD for UI
    trackWASD();
    // Track game state in the console
    logGameStateToConsole(game, 10000);
  }
}

document.querySelector('#play-now').addEventListener('click', () => {
  if (splash) {
    document.body.style.background = '#000000';
    splash.style.display = 'none';
    wrapper.classList.remove('inactive');
  }

  main();
});