import { Game } from './lib/Game';
import { trackWASD, logGameStateToConsole, isActiveElement } from './util';

// Styles
import './css/main.css';

const viewport = document.querySelector('#undead-bytes');
const splash = document.querySelector('.splash');
const canvas = document.querySelector('canvas#game');

function main () {
  if (isActiveElement(viewport) && canvas) {
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
    document.body.classList.remove('body-splash');
    splash.style.display = 'none';
    viewport.classList.remove('inactive');
  }

  main();
});