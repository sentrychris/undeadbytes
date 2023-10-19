import { Map } from './Scene/Map';
import { Camera } from './Scene/Camera';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Wall } from './Wall';
import { BulletFactory } from './Bullet/BulletFactory';

const canvas = document.querySelector('canvas#main');
const context = canvas.getContext('2d');
const camera = new Camera(context);

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

const map = new Map();
map.generate();

const entities = [];
const walls = [];
const enemies = [];
const bulletFactory = new BulletFactory();

const player = new Player(
  map.getPlayerPosition(),
  document.querySelector('div.gameover')
);
entities.push(player);

let weapon = 0;

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
  bulletFactory.update(context, player, walls, mouse, weapon);
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
    case '1': weapon = 0; break;
    case '2': weapon = 1; break;
    case '3': weapon = 2; break;
    case '4': weapon = 3; break;
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