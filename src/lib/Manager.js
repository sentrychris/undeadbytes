import { BulletFactory } from './Bullet/BulletFactory';
import { Enemy } from './Enemy';
import { Player } from './Player';
import { LevelManager } from './Scene/Levels/LevelManager';
import { Map } from './Scene/Map';
import { Wall } from './Wall';

export class Manager
{
  constructor() {
    this.player = null;
    this.entities = [];
    this.walls = [];
    this.enemies = [];

    this.selectedWeaponIndex = 0;
    this.bulletFactory = new BulletFactory();
    
    this.map = new Map();

    this.gameover = false;
    this.levelPassed = false;
  }

  run(tick) {
    requestAnimationFrame(tick);
  }

  setup({ level = 1 }) {
    this.generateMap(level)
      .createPlayer()
      .createEnemies()
      .createWalls();
  }

  onUpdate(context, camera, keyboard, mouse) {
    camera.update(this.player, this.entities);
    this.bulletFactory.update(context, this.player, this.walls, mouse, this.selectedWeaponIndex);
    for (let i = 0; i < this.entities.length; i++) {
      if (typeof this.entities[i] !== undefined
        && typeof this.entities[i].update === 'function') {
        this.entities[i].update(
          context,
          this.player,
          this.enemies,
          this.walls,
          this.bulletFactory,
          camera,
          keyboard,
          mouse
        );
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

    document.querySelector('strong#enemies-remaining').innerHTML = this.enemies.length;
  }

  onRender(context, camera) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    camera.preRender(this.player);
    this.bulletFactory.render();
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render(context);
    }
    camera.postRender();
  }

  onResize(context, camera, width, height) {
    context.canvas.width = width;
    context.canvas.height = height;
    camera.resize();
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

  createKeyboardMouseControls(keyboard, mouse) {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w': keyboard.up = true; break;
        case 's': keyboard.down = true; break;
        case 'a': keyboard.left = true; break;
        case 'd': keyboard.right = true; break;
        case '1': this.selectedWeaponIndex = 0; break;
        case '2': this.selectedWeaponIndex = 1; break;
        case '3': this.selectedWeaponIndex = 2; break;
        case '4': this.selectedWeaponIndex = 3; break;
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
  }
}