import { BulletFactory } from './Bullet/BulletFactory';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Wall } from './Wall';
import { Map } from './Scene/Map';
import { Camera } from './Scene/Camera';
import { config } from '../config';

export class Manager
{
  constructor(context) {
    this.gameID = null;

    this.context = context;
    this.camera = new Camera(this.context);
    this.keyboard = config.device.keyboard;
    this.mouse = config.device.mouse;

    this.map = new Map();
    this.currentLevel = 1;

    this.newGameParams();
  
    this.gameover = false;
    this.levelPassed = false;
  }

  loop() {
    this.onUpdate();
    this.onRender();
  
    if (this.gameover) {
      const gameover = document.querySelector('.game-ended-wrapper');
      if (this.levelPassed) {
        gameover.style.display = 'flex';
        // Proceed to the next level
      } else {
        gameover.style.display = 'flex';
      }
    }
  
    this.run();
  };

  run() {
    this.gameID = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    if (this.gameID) {
      window.cancelAnimationFrame(this.gameID);
      this.gameID = null;
    }
  }

  setup({ level = 1 }, reset = false) {
    if (reset) {
      this.newGameParams();
    }

    this.generateMap(level)
      .createPlayer()
      .createEnemies()
      .createWalls();
  }

  newGameParams() {
    this.player = null;
    this.entities = [];
    this.walls = [];
    this.enemies = [];

    this.selectedWeaponIndex = 0;
    this.bulletFactory = new BulletFactory();
  }

  onUpdate() {
    this.camera.update(this.player, this.entities);
    this.bulletFactory.update(this.context, this.player, this.walls, this.mouse, this.selectedWeaponIndex);

    for (let i = 0; i < this.entities.length; i++) {
      if (typeof this.entities[i] !== undefined && typeof this.entities[i].update === 'function') {
        this.entities[i].update(this.context, this.player, this.enemies, this.walls, this.bulletFactory, this.camera, this.keyboard, this.mouse);
      }

      if (this.entities[i].type === 'player') {
        if (this.isPlayerDead(this.entities[i])) {
          this.gameover = true;
        }
      }

      if (this.entities[i].type === 'enemy') {
        if (this.areAllEnemiesDead(this.entities[i])) {
          this.gameover = true;
          this.levelPassed = true;
        }
      }
    }

    document.querySelector('#enemies-remaining').innerHTML = this.enemies.length;
  }

  onRender() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.camera.preRender(this.player);
    this.bulletFactory.render();
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.context);
    }
    this.camera.postRender();
  }

  onResize(width, height) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.camera.resize();
  }

  generateMap(levelIndex = 0) {
    this.map.generate(levelIndex);
    return this;
  }

  createPlayer() {
    this.player = new Player(this.map.getPlayerPosition());
    this.entities.push(this.player);

    return this;
  }

  createEnemies() {
    for (let i = 0; i < this.map.getEnemyPositions().length; i++) {
      const enemy = new Enemy(this.map.getEnemyPositions()[i]);
      this.entities.push(enemy);
      this.enemies.push(enemy);
    }

    return this;
  }

  createWalls() {
    for (let i = 0; i < this.map.getWallPositions().length; i++) {
      const wallPosition = this.map.getWallPositions()[i];
      const wall = new Wall(wallPosition.x, wallPosition.y);
      
      this.entities.push(wall);
      this.walls.push(wall);
    }

    return this;
  }

  isPlayerDead(entity) {
    return entity.type === 'player' && entity.dead;
  }

  areAllEnemiesDead(entity) {
    return entity.type === 'enemy' && entity.allEnemiesDead;
  }

  createKeyboardMouseControls() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w': this.keyboard.up = true; break;
        case 's': this.keyboard.down = true; break;
        case 'a': this.keyboard.left = true; break;
        case 'd': this.keyboard.right = true; break;
        case '1': this.selectedWeaponIndex = 0; break;
        case '2': this.selectedWeaponIndex = 1; break;
        case '3': this.selectedWeaponIndex = 2; break;
        case '4': this.selectedWeaponIndex = 3; break;
      }
    });
    
    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w': this.keyboard.up = false; break;
        case 's': this.keyboard.down = false; break;
        case 'a': this.keyboard.left = false; break;
        case 'd': this.keyboard.right = false; break;
      }
    });
    
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    });
    
    document.addEventListener('mousedown', () => {
      this.mouse.pressed = true;
    });
    
    document.addEventListener('mouseup', () => {
      this.mouse.pressed = false;
    });
  }
}