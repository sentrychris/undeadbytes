import { Map } from './lib/Scene/Map';
import { Camera } from './lib/Scene/Camera';
import { Player } from './lib/Player';
import { Enemy } from './lib/Enemy';
import { Wall } from './lib/Wall';
import { BulletFactory } from './lib/Bullet/BulletFactory';
import { LevelManager } from './lib/Scene/Levels/LevelManager';
import { randomNumber } from './util';
import { config } from './config';

import './css/main.css';

const canvas = document.querySelector('canvas#main');
const context = canvas.getContext('2d');
const camera = new Camera(context);

const keyboard = config.device.keyboard;
const mouse = config.device.mouse;

const gameEndedDisplay = document.querySelector('.game-ended-wrapper');

const map = new Map();
map.generate(randomNumber(0, (LevelManager.levels.length - 1)));

const entities = [];
const walls = [];
const enemies = [];

let selectedWeaponIndex = 0;
const bulletFactory = new BulletFactory();

const player = new Player(
  map.getPlayerPosition(),
  gameEndedDisplay,
  LevelManager
);
entities.push(player);

for (let i = 0; i < map.getEnemyPositions().length; i++) {
  const enemy = new Enemy(map.getEnemyPositions()[i]);
  entities.push(enemy);
  enemies.push(enemy);
}

for (let i = 0; i < map.getWallPositions().length; i++) {
  const wallPosition = map.getWallPositions()[i];
  const wall = new Wall(wallPosition.x, wallPosition.y);
  entities.push(wall);
  walls.push(wall);
}

const onResize = (width, height) => {
  context.canvas.width = width;
  context.canvas.height = height;
  camera.resize();
};

const onUpdate = () => {
  camera.update(player, entities);
  bulletFactory.update(context, player, walls, mouse, selectedWeaponIndex);
  for (let i = 0; i < entities.length; i++) {
    if (typeof entities[i] !== undefined && typeof entities[i].update === 'function') {
      entities[i].update(
        context,
        player,
        enemies,
        walls,
        bulletFactory,
        camera,
        keyboard,
        mouse
      );
    }
  }

  document.querySelector('strong#enemies-remaining').innerHTML = enemies.length;

  if (enemies.length === 0) {
    setTimeout(() => {
      gameEndedDisplay.style.display = 'flex';
    }, 1000);
  }
};

const onRender = () => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  camera.preRender(player);
  bulletFactory.render();
  for (let i = 0; i < entities.length; i++) {
    entities[i].render(context);
  }
  camera.postRender();
}

const resizeCallback = () => {
  onResize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', resizeCallback);
resizeCallback();

const tickCallback = () => {
  onUpdate();
  onRender();
  requestAnimationFrame(tickCallback);
};
requestAnimationFrame(tickCallback);

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': keyboard.up = true; break;
    case 's': keyboard.down = true; break;
    case 'a': keyboard.left = true; break;
    case 'd': keyboard.right = true; break;
    case '1': selectedWeaponIndex = 0; break;
    case '2': selectedWeaponIndex = 1; break;
    case '3': selectedWeaponIndex = 2; break;
    case '4': selectedWeaponIndex = 3; break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w': keyboard.up = false; break;
    case 's': keyboard.down = false; break;
    case 'a': keyboard.left = false; break;
    case 'd': keyboard.right = false; break;
  }
});

document.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

document.addEventListener('mousedown', (event) => {
  mouse.pressed = true;
});

document.addEventListener('mouseup', (event) => {
  mouse.pressed = false;
});