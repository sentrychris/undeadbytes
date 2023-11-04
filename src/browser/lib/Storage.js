import { AudioFX } from './Audio/AudioFX';
import { config } from '../config';
import { timestamp } from '../util';

/**
 * Storage
 * @class
 * @category Game Admin
 */
export class Storage
{
  /**
   * Create a new storage handler.
   * 
   * @constructor
   * @param {string|Object} bridge - the execution context bridge
   * @param {Object} dispatcher - the custom event dispatcher
   * @param {Object} params 
   * @param {boolean} params.register - register handlers immediately or defer 
   */
  constructor (bridge, dispatcher, { register = false }) {

    /**
     * localStorageSettingsKey - the key for settings from localstorage in the web context
     * @type {string}
     */
    this.localStorageSettingsKey = 'undeadbytes-game';

    /**
     * settings - the default game settings
     * @type {Object}
     */
    this.settings = {
      godmode: false,
      difficulty: 'medium',
      volumes: config.volumes
    };

    /**
     * bridge - the execution context bridge
     * @type {string|Object}
     */
    this.bridge = bridge;

    /**
     * dispatcher - the custom game event dispatcher
     * @type {Object}
     */
    this.dispatcher = dispatcher;

    /**
     * Whether or not the game has been instantiated past the splash screen
     * @type {boolean}
     */
    this.gameInstanceAttached = false;

    if (this.bridge === 'web') {
      this.configureLocalStorage();
    } else {
      this.configureFileStorage();
      this.loadGameSavesFromBridge();
    }

    if (register) {
      this.register();
    }
  }

  /**
   * Register storage handlers for various game mechanics.
   * 
   * @returns {void}
   */
  register () {
    this.setVolumeSettings();
  }

  /**
   * Set the execution context bridg.
   * 
   * If the game is runing through the browser on the web, then the bridge
   * will simply be set to "web", otherwise it will contain the IPC event emitter
   * for bi-directional communication between the browser and the node runtime.
   * 
   * @param {string|Object} bridge - the execution context bridge
   * 
   * @returns {void}
   */
  setBridge (bridge) {
    this.bridge = bridge;
  }

  /**
   * Set the flag to indicate that the game is instantiated.
   * 
   * @param {boolean} isCreated - whether or not the game is insantiated
   * 
   * @returns {void}
   */
  setGameInstanceAttached (isCreated = false) {
    this.gameInstanceAttached = isCreated;
  }

  /**
   * Set settings from storage.
   * 
   * @param {Object} settings - the settings object
   * @param {boolean} persist - whether or not to persist settings on load
   * 
   * @returns {void}
   */
  setSettings (settings, persist = false) {
    this.settings = settings;

    if (persist) {
      if (this.bridge === 'web') {
        this.saveLocalStorageSettings();
      } else {
        this.saveFileSettings();
      }
    }
  }

  /**
   * Set an individual setting.
   * 
   * @param {string} key - the setting object key
   * @param {string|number|boolean} value the setting key value
   * @param {boolean} persist - whether or not to save the setting to storage
   * 
   * @returns {void}
   */
  setSetting (key, value, persist = false) {
    this.settings[key] = value;

    if (persist) {
      if (this.bridge === 'web') {
        this.saveLocalStorageSettings();
      } else {
        this.saveFileSettings();
      }
    }
  }

  /**
   * Configure file-based storage when running as a desktop app.
   * 
   * @returns {void}
   */
  configureFileStorage () {
    this.bridge.receive('from:settings:set', (settings) => {
      if (settings) {
        this.setSettings(settings);
        this.register();
      }
    });
  }

  /**
   * Configure local stroage when running through the browser.
   * 
   * @returns {void}
   */
  configureLocalStorage () {
    // Get stored settings
    const settings = JSON.parse(
      localStorage.getItem(this.localStorageSettingsKey)
    );

    if (! settings) {
      // Set defaults if there are no stored settings
      this.saveLocalStorageSettings();
    } else {
      // Update tracked settings
      this.setSettings(settings);
    }
  }

  /**
   * Save settings to local storage when running in the browser
   * 
   * @returns {void}
   */
  saveLocalStorageSettings () {
    localStorage.setItem(
      this.localStorageSettingsKey,
      JSON.stringify(this.settings)
    );
  }

  /**
   * Save settings to file when running as a deskto app
   * 
   * @returns {void}
   */
  saveFileSettings () {
    this.bridge.send('to:settings:save', {
      settings: this.settings
    });
  }

  /**
   * Load save games from emitted IPC event when running as a desktop app
   * 
   * @returns {void}
   */
  loadGameSavesFromBridge () {
    this.bridge.receive('from:game:save', (save) => {
      if (this.gameInstanceAttached) {
        this.dispatcher.loadGame({ save });
      } else {
        this.dispatcher.loadGame({
          save,
          instantiate: true
        });
      }
    });
  }

  /**
   * Load saved games from local storage when running through the browser
   * 
   * @param {HTMLElement} loader - element to append saved games list to load from
   * 
   * @returns {void}
   */
  loadGameSavesFromLocalStorage (loader) {
    const storage = JSON.parse(localStorage.getItem(config.game.savesLocalStorageKey));

    if (storage && storage.saves) {
      const createSavedGameItem = (save) => {
        const node = document.createElement('p');
        node.classList.add('load-game__item');
        node.innerHTML = `[${save.date}] - Level ${save.level} | Medkits - ${save.player.pickups.health} | Load Game...`;
        node.dataset.save = save.name;
        
        return node;
      };

      for (const save of storage.saves) {
        const node = createSavedGameItem(save);
        
        node.onclick = (e) => {
          const save = storage.saves.find((s) => s.name === e.target.dataset.save);
          this.dispatcher.loadGame({
            save,
            instantiate: true
          });
        };

        loader.appendChild(node);
      }
    }
  }

  /**
   * Handle saving game to storage.
   * 
   * @param {Object} game - the managed game instance
   * 
   * @returns {void}
   */
  saveGame (game) {
    const save = {
      name: timestamp(true),
      date: timestamp(),
      level: game.currentLevel,
      player: {
        pickups: {
          health: game.player.pickups.health
        }
      }
    };

    if (this.bridge !== 'web') {
      this.bridge.send('to:game:save', {
        save
      });
    } else {
      let storage = JSON.parse(localStorage.getItem(config.game.savesLocalStorageKey));
      if (storage && storage.saves) {
        storage = storage.saves;
      } else {
        storage = [];
      }

      storage.push(save);
      localStorage.setItem(config.game.savesLocalStorageKey, JSON.stringify({
        saves: storage
      }));
    }
  }

  /**
   * Store and set volume settings.
   * 
   * @param {Object} volume - the audio object to set
   * 
   * @returns {void}
   */
  setVolumeSettings (volume = null) {
    if (! volume) {
      // If no volume is passed then we're setting defaults
      // or loading existing settings
      volume = this.settings.volumes;
    }

    if (volume.fx && volume.fx.weapon) {
      AudioFX.volume('weapon', volume.fx.weapon);
    }

    if (volume.fx && volume.fx.snippet) {
      AudioFX.volume('snippet', volume.fx.snippet);
    }

    if (volume.soundtrack) {
      AudioFX.volume('soundtrack', volume.soundtrack);
    }

    // Update tracked settings' volume property
    this.settings.volumes = volume;

    if (this.bridge === 'web') {
      this.saveLocalStorageSettings();
    }

    this.setUIState('volume');
  }

  /**
   * Store and set difficulty settings.
   * 
   * @param {string} difficulty - the difficulty setting "easy", "medium", or "hard"
   * 
   * @returns {void}
   */
  setDifficultySettings (difficulty) {
    this.difficulty = difficulty;
  }

  /**
   * Store and set god-mode setting.
   * 
   * @param {boolean} godmode - whether or not god-mode is enabled
   * 
   * @returns {void}
   */
  setGodModeSettings (godmode) {
    this.godmode = godmode;
  }

  /**
   * Set the UI state depending on the value of stored settings, i.e volume sliders.
   * 
   * @param {string} key - the type of UI object to set
   * 
   * @returns {void}
   */
  setUIState (key) {
    if (key === 'volume') {
      const sliders = document.querySelectorAll('.volume-slider');
      for (const target of sliders) {
        const { control } = target.dataset;

        const volume =  ['weapon', 'snippet'].includes(control)
          ? this.settings.volumes.fx[control]
          : this.settings.volumes[control];

        target.value = volume;

        const percent = Math.round(volume * 100);
        
        target.style.background = 'linear-gradient(to right, #50ffb0 0%, #50ffb0 ' +
          percent + '%, #fff ' + percent + '%, #fff 100%)';
      }
    }
  }
}