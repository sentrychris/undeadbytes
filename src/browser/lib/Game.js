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
import { ubcolors, randomFromArray } from '../util';
import Stats from 'stats.js';

/**
 * Represents the main game class responsible for managing game entities,
 * controls, and rendering.
 * @class
 * @category Game Admin
 */
export class Game
{
  /**
   * Create a new game instance.
   * 
   * @constructor
   * @param {Object} bridge - The execution context bridge e.g. "web" or IPC handler.
   * @param {Object} dispatcher - The dispatcher object for custom game events.
   * @param {Object} context - The canvas rendering context.
   */
  constructor (bridge, dispatcher, context) {
    /**
     * bridge - the execution context bridge
     * @type {string|Object}
     */
    this.bridge = bridge;

    /**
     * dispatcher - the game custom event dispatcher
     * @type {Object}
     */
    this.dispatcher = dispatcher;

    /**
     * frame - the current game frame ID
     * @type {number}
     */
    this.frame = null;

    /**
     * stopped - Whether or not the game loop is stopped
     * @type {boolean}
     */
    this.stopped = false;

    /**
     * handlers - the game handlers e.g. storage
     * @type {Object}
     */
    this.handlers = { storage: null };
    
    /**
     * context - the canvas rendering context
     * @type {CanvasRenderingContext2D}
     */
    this.context = context;

    /**
     * camera - the game camera
     * @type {Camera}
     */
    this.camera = new Camera(this.context);

    /**
     * keyboard - the game default keyboard configuration
     * @type {Objet}
     */
    this.keyboard = config.device.keyboard;

    /**
     * mouse - the game default mouse configuration
     * @type {Objet}
     */
    this.mouse = config.device.mouse;

    /**
     * map - the game map generator
     * @type {Map}
     */
    this.map = new Map();

    /**
     * currentLevel - the current game level
     * @type {number}
     */
    this.currentLevel = 1;
  
    /**
     * gameover - whether or not the current game is over
     * @type {boolean}
     */
    this.gameover = false;

    /**
     * levelPassed - whether or not the current level was passed
     * @type {Objet}
     */
    this.levelPassed = false;

    /**
     * overlay - the game-end overlay
     * @type {HTMLElement}
     */
    this.overlay = document.querySelector('.game-overlay');

    /**
     * Statistics counter for FPS
     * @type {Stats}
     */
    this.stats = new Stats();

    // Setup new game entities
    this.newGameEntities();

    const onResize = () => this.onResize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onResize);
    onResize();

    this.onDispatch();

    this.createKeyboardMouseControls();
    this.createVolumeControls();
  }

  /**
   * Create new game entities and params.
   * 
   * @returns {void}
   */
  newGameEntities () {
    /**
     * player - the entity representing the player
     * @type {Player}
     */
    this.player = null;

    /**
     * entities - array containing all game entities
     * @type {array}
     */
    this.entities = [];

    /**
     * walls - array containing all wall entities
     * @type {array}
     */
    this.walls = [];

    /**
     * enemies - array containing all enemy entities
     * @type {array}
     */
    this.enemies = [];

    /**
     * ammoPickups - array containing all ammo pickup item entities
     * @type {array}
     */
    this.ammoPickups = [];
    
    /**
     * healthPickups - array containing all health pickup item entities
     * @type {array}
     */
    this.healthPickups = [];

    /**
     * staminaPickups - array containing all stamina pickup item entities
     * @type {array}
     */
    this.staminaPickups = [];

    /**
     * selectedWeaponIndex - the current selected mapped weapon index
     * @type {number}
     */
    this.selectedWeaponIndex = 0;

    /**
     * ballistics - game ballistics handler
     * @type {Ballistics}
     */
    this.ballistics = new Ballistics();
  }

  /**
   * Attach a handler to the game, e.g. a storage handler
   * 
   * @param {string} handler - the handler key
   * @param {Object} instance - the handler object
   * 
   * @returns {void}
   */
  attach (handler, instance) {
    this.handlers[handler] = instance;

    if (handler === 'storage') {
      // Signal to storage that an attached game instance exists
      this.handlers.storage.setGameInstanceAttached(true);
    }
  }

  /**
   * Start the game loop
   * 
   * @returns {void}
   */
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


  /**
   * Run the game frames
   * 
   * @returns {void}
   */
  run () {
    if (! this.frame && ! this.stopped) {
      this.frame = requestAnimationFrame(this.loop.bind(this));
    }
  }

  /**
   * Restart the game
   * 
   * @returns {void}
   */
  restart () {
    if (this.levelPassed) {
      this.stop().then(async (stopped) => await this.start(stopped, true));
    } else {
      this.stop().then(async (stopped) => await this.start(stopped, false));
    }
  }

  /**
   * Start the game
   * 
   * @param {boolean} stopped - whether or not the game is stopped
   * @param {boolean} nextLevel - whether or not to start the next level
   * @param {number|null} savedLevel - whether or not to start from a saved level
   * 
   * @returns {void}
   */
  async start (stopped, nextLevel = false, savedLevel = null) {
    if (stopped && ! this.frame) {
      this.overlay.querySelector('h1').innerHTML = '';

      if (nextLevel) {
        ++this.currentLevel;
      }

      if (savedLevel) {
        this.currentLevel = savedLevel;
      }

      setTimeout(() => {
        this.overlay.style.display = 'none';
        this.setup({
          level: this.currentLevel
        }, true);
      }, 2500);
    }
  }

  /**
   * Pause the game
   * 
   * @returns {void}
   */
  async pause () {
    const hotkey = document.querySelector('span[data-hotkey="P"]');
    const state = document.querySelector('#game-pause-state');
    const cssclass = 'help-block__hotkey--active';
    if (! this.stopped) {
      this.stopped = true;
      cancelAnimationFrame(this.frame);
      hotkey.classList.add(cssclass);
      state.innerHTML = 'Game Paused';
    } else {
      hotkey.classList.remove(cssclass);
      state.innerHTML = 'Pause Game';
      this.stopped = false;
      this.frame = requestAnimationFrame(this.loop.bind(this));
    }

    return this.stopped;
  }


  /**
   * Stop the game
   * 
   * @returns {void}
   */
  async stop () {
    this.stopped = true;
    this.frame = null;
    cancelAnimationFrame(this.loop.bind(this));

    return this.stopped;
  }

  /**
   * Setup a new game
   * 
   * @param {Object} params
   * @param {number} params.level - the level to setup
   * @param {boolean} loop - whether or not to start the game loop immediately
   * 
   * @returns {void}
   */
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

  /**
   * Handle all entity update events during the game loop.
   * 
   * @returns {void}
   */
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

      if (this.entities[i].type === 'pickup' && this.entities[i].markToDelete) {
        this.entities.splice(i, 1);
      }
    }

    document.querySelector('#enemies-remaining').innerHTML = this.enemies.length;
  }


  /**
   * Handles all entity render events during the game loop.
   * 
   * @returns {void}
   */
  onRender () {
    this.camera.newScene();
    this.camera.preRender(this.player);

    this.ballistics.render();
    
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.context);
    }

    this.camera.postRender();
  }

  /**
   * Handles all custom dispatcher events during the game loop.
   * 
   * @returns {void}
   */
  onDispatch () {
    this.dispatcher.addEventListener('game:load', ({ save }) => {
      this.overlay.style.display = 'flex';
      this.overlay.querySelector('h1').innerHTML = 'Loading game...';
      this.stop().then(async (stopped) => {
        await this.start(stopped, false, save.level);
      });
    });
  }


  /**
   * Handles all resize events during the game loop.
   * 
   * @returns {void}
   */
  onResize (width, height) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    
    this.camera.resize();
  }

  /**
   * Generate a new map based on the passed level index.
   * 
   * @param {number} levelIndex - the level to generate the map for
   * 
   * @returns {this}
   */
  generateMap (levelIndex = 0) {
    this.map.newMapConfiguration();
    this.map.generate(levelIndex);

    return this;
  }

  /**
   * Determines whether or not the given entity has an update() method implementation.
   * 
   * @param {Object} entity 
   * 
   * @returns {boolean}
   */
  canUpdateEntity (entity) {
    return typeof entity !== 'undefined' && typeof entity.update === 'function';
  }

  /**
   * Create a new player entity.
   * 
   * @returns {this}
   */
  createPlayer () {
    this.player = new Player(this.map.getPlayerPosition());
    this.entities.push(this.player);

    return this;
  }

  /**
   * Create new enemy entities.
   * 
   * @returns {this}
   */
  createEnemies () {
    for (let i = 0; i < this.map.getEnemyPositions().length; i++) {
      const enemy = new Enemy(this.map.getEnemyPositions()[i], {
        hands: randomFromArray(ubcolors),
        feet:  randomFromArray(ubcolors),
        torso: randomFromArray(ubcolors)
      });

      this.entities.push(enemy);
      this.enemies.push(enemy);
    }

    return this;
  }

  /**
   * Create a new walls for the map.
   * 
   * @returns {this}
   */
  createWalls () {
    for (let i = 0; i < this.map.getWallPositions().length; i++) {
      const wall = new Wall(this.map.getWallPositions()[i], true);
      this.entities.push(wall);
      this.walls.push(wall);
    }

    return this;
  }

  /**
   * Create a new ammo pickup items for the map.
   * 
   * @returns {this}
   */
  createAmmoPickups () {
    for (let i = 0; i < this.map.getAmmoPickupPositions().length; i++) {
      const ammoPickup = new Ammo(this.map.getAmmoPickupPositions()[i]);
      this.entities.push(ammoPickup);
      this.ammoPickups.push(ammoPickup);
    }

    return this;
  }

  /**
   * Create a new health pickup items for the map.
   * 
   * @returns {this}
   */
  createHealthPickups () {
    for (let i = 0; i < this.map.getHealthPickupPositions().length; i++) {
      const healthPickup = new Health(this.map.getHealthPickupPositions()[i]);
      this.entities.push(healthPickup);
      this.healthPickups.push(healthPickup);
    }

    return this;
  }

  /**
   * Create a new stamina pickup items for the map.
   * 
   * @returns {this}
   */
  createStaminaPickups () {
    for (let i = 0; i < this.map.getStaminaPickupPositions().length; i++) {
      const staminaPickup = new Stamina(this.map.getStaminaPickupPositions()[i]);
      this.entities.push(staminaPickup);
      this.staminaPickups.push(staminaPickup);
    }

    return this;
  }

  /**
   * Determine whether or not the player is dead.
   * 
   * @param {Player} entity - the entity representing the player
   * 
   * @returns {boolean}
   */
  isPlayerDead (entity) {
    return entity.type === 'player' && entity.dead;
  }

  /**
   * Determine whether or not all enemies are dead based on the enemy entity's
   * allEnemiesDead property.
   * 
   * @param {Enemy} entity - the entity representing the enemy
   * 
   * @returns {boolean}
   */
  areAllEnemiesDead (entity) {
    return entity.type === 'enemy' && entity.allEnemiesDead;
  }

  /**
   * Display the game-end overlay.
   * 
   * @returns {void}
   */
  displayGameEnd () {
    const overlay = this.overlay;
    setTimeout(() => {
      if (this.levelPassed) {
        overlay.querySelector('h1').innerHTML = 'You Win!';
        overlay.classList.add('pass');
        overlay.classList.remove('fail');
      } else {
        overlay.querySelector('h1').innerHTML = 'You Died!';
        overlay.classList.remove('pass');
        overlay.classList.add('fail');
      }
      overlay.style.display = 'flex';
    }, 500);
  }

  /**
   * Set the active weapon hotkey for the UI.
   * 
   * @returns {void}
   */
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

    this.ballistics.setEquippedWeaponDisplayInformation(
      this.selectedWeaponIndex
    );
  }

  /**
   * Create game keyboard-mouse controls and register event listeners.
   * 
   * @returns {void}
   */
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
      case 'h':
        this.player.refillHealth(config.pickups.health, false);
        break;
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
      case '.':
        this.handlers.storage.saveGame(this);
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

  /**
   * Create volume slider controls for game audio.
   * 
   * @returns {void}
   */
  createVolumeControls () {
    const sliders = document.querySelectorAll('.volume-slider');
    for (const slider of sliders) {
      slider.addEventListener('input', (e) => {
        const { target } = e;
        const value = (target.value - target.min) / (target.max - target.min);
        const percent = Math.round(value * 100);
        
        target.style.background = 'linear-gradient(to right, #50ffb0 0%, #50ffb0 ' +
          percent + '%, #fff ' + percent + '%, #fff 100%)';
      
        AudioFX.volume(target.dataset.control, value);

        if (this.handlers.storage) {
          setTimeout(() => {
            this.handlers.storage.setSetting('volumes', AudioFX.volumes, true);
          }, 1000);
        }
      });
    }
  }

  /**
   * Toggle the FPS stats counter.
   * 
   * @param {number} panel - 0 = fps, 1 = ms,  2 = mb, 3+ = custom
   * 
   * @returns {void}
   */
  toggleStats (panel = 0) {
    this.stats.showPanel(panel);

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