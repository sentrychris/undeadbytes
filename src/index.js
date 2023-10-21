import { Camera } from './lib/Scene/Camera';
import { Manager } from './lib/Manager';
import { config } from './config';
import './css/main.css';

// Create the canvas, set the context for rendering
// and setup the camera tracking implementation
const canvas = document.querySelector('canvas#main');
const context = canvas.getContext('2d');
const camera = new Camera(context);

// Initialise devices
const keyboard = config.device.keyboard;
const mouse = config.device.mouse;

// Create a new game manager and setup a new game
const manager = new Manager();
manager.setup({
  level: 0
});

// Add resize event listeners
const onResize = () => manager.onResize(context, camera, window.innerWidth, window.innerHeight);
window.addEventListener('resize', onResize);
onResize();

// Register listeners for the game controls
manager.createKeyboardMouseControls(keyboard, mouse);

// Handle the game loop
const tick = () => {
  manager.onUpdate(context, camera, keyboard, mouse);
  manager.onRender(context, camera);
  requestAnimationFrame(tick);
};

// Run the game loop
manager.run(tick);