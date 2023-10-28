import { Player } from './Entity/Player';
import { Enemy } from './Entity/Enemy';
import { Wall } from './Entity/Wall';
import { Ammo } from './Entity/Pickup/Ammo';
import { Health } from './Entity/Pickup/Health';
import { Stamina } from './Entity/Pickup/Stamina';
import { Ballistics } from './Ballistics/Ballistics';
import { AudioFX } from './Audio/AudioFX';
import { Camera } from './Scene/Camera';
import { Map } from './Scene/Map';
import { config } from '../config';
import Stats from 'stats.js';

export class Game
{
  constructor (context) {
    this.frame = null;
    this.stopped = false;
    
    this.context = context;
    this.camera = new Camera(this.context);
    this.keyboard = config.device.keyboard;
    this.mouse = config.device.mouse;

    this.map = new Map();
    this.currentLevel = 1;

    this.newGameEntities();
  
    this.gameover = false;
    this.levelPassed = false;

    const onResize = () => this.onResize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onResize);
    onResize();

    this.createKeyboardMouseControls();

    this.stats = new Stats();
  }

  loop () {
    this.stats.begin();

    AudioFX.soundtrack();

    if (! this.stopped) {
      this.frame = null;
      this.onUpdate();
      this.onRender();
    }
  
    if (this.gameover) {
      this.displayGameEnd();
      this.restart();
    }

    this.stats.end();
  
    this.run();
  }

  run () {
    if (! this.frame && ! this.stopped) {
      this.frame = requestAnimationFrame(this.loop.bind(this));
    }
  }

  restart () {
    if (this.levelPassed) {
      this.stop().then(async (stopped) => await this.start(stopped, true));
    } else {
      this.stop().then(async (stopped) => await this.start(stopped, false));
    }
  }

  async start (stopped, nextLevel = false) {
    if (stopped && ! this.frame) {
      const gameover = document.querySelector('.game-ended');

      if (nextLevel) {
        ++this.currentLevel;
      }

      setTimeout(() => {
        gameover.style.display = 'none';
        this.setup({
          level: this.currentLevel
        }, true);
      }, 2000);
    }
  }

  async pause () {
    const hotkey =document.querySelector('span[data-hotkey="P"]');
    const state = document.querySelector('#game-pause-state');
    const overlay = document.querySelector('.overlay');
    const cssclass = 'help-block__hotkey--active';
    if (! this.stopped) {
      this.stopped = true;
      cancelAnimationFrame(this.frame);
      hotkey.classList.add(cssclass);
      state.innerHTML = 'Game Paused';
      overlay.style.display = 'block';
    } else {
      hotkey.classList.remove(cssclass);
      state.innerHTML = 'Pause Game';
      overlay.style.display = 'none';
      this.stopped = false;
      this.frame = requestAnimationFrame(this.loop.bind(this));
    }

    return this.stopped;
  }

  async stop () {
    this.stopped = true;
    this.frame = null;
    cancelAnimationFrame(this.loop.bind(this));

    return this.stopped;
  }

  setup ({ level = 1 }, loop = false) {
    this.frame = null;
    this.stopped = false;
    this.gameover = false;
    this.currentLevel = level;
    this.levelPassed = false;
    
    this.newGameEntities();

    this.generateMap(level)
      .createPlayer()
      .createEnemies()
      .createWalls()
      .createAmmoPickups()
      .createHealthPickups()
      .createStaminaPickups();

    document.querySelector('#current-level').innerHTML = this.currentLevel;

    this.setWeaponHotKey();

    this.onResize(window.innerWidth, window.innerHeight);

    if (loop) {
      this.loop();
    }
  }

  newGameEntities () {
    this.player = null;
    this.entities = [];
    this.walls = [];
    this.enemies = [];
    this.ammoPickups = [];
    this.healthPickups = [];
    this.staminaPickups = [];

    this.selectedWeaponIndex = 0;
    this.ballistics = new Ballistics();
  }

  onUpdate () {
    this.camera.update(this.player, this.entities);
    this.ballistics.update(this);

    for (let i = 0; i < this.entities.length; i++) {
      if (this.canUpdateEntity(this.entities[i])) {
        this.entities[i].update(this);
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

      if (this.entities[i].type === 'pickup') {
        if (this.entities[i].markToDelete) {
          if (this.entities[i].item === 'ammo') {
            this.ballistics.refillWeaponAmmoClip();
          }

          if (this.entities[i].item === 'health') {
            this.player.refillHealth(this.entities[i].value);
          }

          if (this.entities[i].item === 'stamina') {
            this.player.boostSpeed(this.entities[i].value);
          }

          // Remove picked up entities
          this.entities.splice(i, 1);
        }
      }
    }

    document.querySelector('#enemies-remaining').innerHTML = this.enemies.length;
  }

  onRender () {
    this.camera.newScene();
    this.camera.preRender(this.player);

    this.ballistics.render();
    
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.context);
    }

    this.camera.postRender();
  }

  onResize (width, height) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    
    this.camera.resize();
  }

  generateMap (levelIndex = 0) {
    this.map.newMapConfiguration();
    this.map.generate(levelIndex);

    return this;
  }

  canUpdateEntity (entity) {
    return typeof entity !== 'undefined' && typeof entity.update === 'function';
  }

  createPlayer () {
    this.player = new Player(this.map.getPlayerPosition());
    this.entities.push(this.player);

    return this;
  }

  createEnemies () {
    for (let i = 0; i < this.map.getEnemyPositions().length; i++) {
      const enemy = new Enemy(this.map.getEnemyPositions()[i]);
      this.entities.push(enemy);
      this.enemies.push(enemy);
    }

    return this;
  }

  createWalls () {
    for (let i = 0; i < this.map.getWallPositions().length; i++) {
      const wallPosition = this.map.getWallPositions()[i];
      const wall = new Wall(wallPosition.x, wallPosition.y, true);
      
      this.entities.push(wall);
      this.walls.push(wall);
    }

    return this;
  }

  createAmmoPickups () {
    for (let i = 0; i < this.map.getAmmoPickupPositions().length; i++) {
      const ammoPickupPosition = this.map.getAmmoPickupPositions()[i];
      const ammoPickup = new Ammo(ammoPickupPosition.x, ammoPickupPosition.y);
      
      this.entities.push(ammoPickup);
      this.ammoPickups.push(ammoPickup);
    }

    return this;
  }

  createHealthPickups () {
    for (let i = 0; i < this.map.getHealthPickupPositions().length; i++) {
      const healthPickupPosition = this.map.getHealthPickupPositions()[i];
      const healthPickup = new Health(healthPickupPosition.x, healthPickupPosition.y);
      
      this.entities.push(healthPickup);
      this.healthPickups.push(healthPickup);
    }

    return this;
  }

  createStaminaPickups () {
    for (let i = 0; i < this.map.getStaminaPickupPositions().length; i++) {
      const staminaPickupPosition = this.map.getStaminaPickupPositions()[i];
      const staminaPickup = new Stamina(staminaPickupPosition.x, staminaPickupPosition.y);
      
      this.entities.push(staminaPickup);
      this.staminaPickups.push(staminaPickup);
    }

    return this;
  }

  isPlayerDead (entity) {
    return entity.type === 'player' && entity.dead;
  }

  areAllEnemiesDead (entity) {
    return entity.type === 'enemy' && entity.allEnemiesDead;
  }

  displayGameEnd () {
    const gameover = document.querySelector('.game-ended');
    setTimeout(() => {
      if (this.levelPassed) {
        gameover.querySelector('h1').innerHTML = 'You Win!';
        gameover.classList.add('pass');
        gameover.classList.remove('fail');
      } else {
        gameover.querySelector('h1').innerHTML = 'You Died!';
        gameover.classList.remove('pass');
        gameover.classList.add('fail');
      }
      gameover.style.display = 'flex';
    }, 500);
  }

  setWeaponHotKey () {
    const hotkeys = document.querySelectorAll('span.help-block__hotkey');
    const cssclass = 'help-block__hotkey--active';
    for (const key of hotkeys) {
      const { hotkey } = key.dataset;
      if (hotkey) {
        if (parseInt(hotkey) !== (this.selectedWeaponIndex+1)) {
          key.classList.remove(cssclass);
        } else {
          key.classList.add(cssclass);
        }
      }
    }
  }

  createKeyboardMouseControls () {
    window.addEventListener('keydown', async (e) => {
      if (e.key === 'p') await this.pause();
    });

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
      case 'w': this.keyboard.up = true; break;
      case 's': this.keyboard.down = true; break;
      case 'a': this.keyboard.left = true; break;
      case 'd': this.keyboard.right = true; break;
      case '1':
        this.selectedWeaponIndex = 0;
        this.setWeaponHotKey();
        break;
      case '2':
        this.selectedWeaponIndex = 1;
        this.setWeaponHotKey();
        break;
      case '3':
        this.selectedWeaponIndex = 2;
        this.setWeaponHotKey();
        break;
      case '4':
        this.selectedWeaponIndex = 3;
        this.setWeaponHotKey();
        break;
      case '5':
        this.selectedWeaponIndex = 4;
        this.setWeaponHotKey();
        break;
      case '*':
        this.toggleStats();
        break;
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

  toggleStats (panel = 0) {
    this.stats.showPanel(panel); // 0 = fps, 1 = ms,  2 = mb, 3+ = custom

    if (! this.statsShown) {
      this.stats.domElement.style.cssText = 'position:absolute;top:0px;right:0px;';
      this.statsShown = true;
    } else {
      this.stats.domElement.style.cssText = 'display:none;';
      this.statsShown = false;
    }

    const stats = document.querySelector('.stats');
    if (stats) {
      stats.appendChild(this.stats.dom);
    }
  }
}