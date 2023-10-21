import { Manager } from './lib/Manager';
import './css/main.css';

// Create a new game manager and setup a new game
const manager = new Manager(document.querySelector('canvas#main').getContext('2d'));
manager.setup({
  level: 0
});

// Add resize event listeners
const onResize = () => manager.onResize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', onResize);
onResize();

// Add game control listeners
manager.createKeyboardMouseControls();

// Handle the game loop
const tick = () => {
  manager.onUpdate();
  manager.onRender();

  if (manager.gameover) {
    if (manager.levelPassed) {
      // document.querySelector('.game-ended-wrapper').style.display = 'flex';
      // Proceed to the next level
    } else {
      document.querySelector('.game-ended-wrapper').style.display = 'flex';
      // Clear all entities and rebuild level
    }
  }

  requestAnimationFrame(tick);
};

// Run the game loop
manager.run(tick);