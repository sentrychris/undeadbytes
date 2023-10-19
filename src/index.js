import { Map } from './Scene/Map';
import { Camera } from './Scene/Camera';
import { Player } from './Player/Player';
import { Enemy } from './Enemy/Enemy';
import { Wall } from './Entity/Wall';
import { BulletFactory } from './Bullet/BulletFactory';

const canvas = document.querySelector('canvas#main');
const context = canvas.getContext('2d');
const keyboard = {
  up: false,
  down: false,
  left: false,
  right: false
};

const mouse = {
  x: 0,
  y: 0,
  pressed: false
};

const entities = [];
const walls = [];
const enemies = [];

const map = new Map();
map.generate();

const playerPosition = map.getPlayerPosition();
const player = new Player(
  playerPosition.x,
  playerPosition.y,
  document.querySelector('div.gameover')
);

for (let i = 0; i < map.getEnemyPositions().length; i++) {
  const enemyPosition = map.getEnemyPositions()[i];
  const enemy = new Enemy(enemyPosition.x, enemyPosition.y);

  entities.push(enemy);
  enemies.push(enemy);
}

entities.push(player);

for (let i = 0; i < map.getWallPositions().length; i++) {
  const wallPosition = map.getWallPositions()[i];
  const wall = new Wall(wallPosition.x, wallPosition.y);

  entities.push(wall);
  walls.push(wall);
}

const camera = new Camera(context);

const onResize = (width, height) => {
  context.canvas.width = width;
  context.canvas.height = height;
  camera.resize();
};

const bulletFactory = new BulletFactory();

const onUpdate = () => {
  camera.update(player, entities);
  bulletFactory.update(context, player, walls, mouse);
  for (let i = 0; i < entities.length; i++) {
    entities[i].update(context, player, enemies, walls, bulletFactory, camera, keyboard, mouse);
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
  console.log({ event })
  switch (event.key) {
    case 'w': keyboard.up = true; break;
    case 's': keyboard.down = true; break;
    case 'a': keyboard.left = true; break;
    case 'd': keyboard.right = true; break;
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