import { Camera } from './lib/Scene/Camera';
import { config } from './config';
import { Manager } from './Manager';

import './css/main.css';

const canvas = document.querySelector('canvas#main');
const context = canvas.getContext('2d');
const camera = new Camera(context);

const keyboard = config.device.keyboard;
const mouse = config.device.mouse;

const manager = new Manager();
manager.setup();

const onUpdate = () => manager.onUpdate(context, camera, keyboard, mouse);
const onRender = () => manager.onRender(context, camera);
const onResize = () => manager.onResize(context, camera, window.innerWidth, window.innerHeight);

window.addEventListener('resize', onResize);
onResize();

manager.createKeyboardMouseControls(keyboard, mouse);

const tick = () => {
  onUpdate();
  onRender();
  requestAnimationFrame(tick);
};

manager.run(tick);