import { AudioFX } from './Audio/AudioFX';
import { config } from '../config';

export class Storage
{
  constructor (bridge, dispatcher, { register = false }) {
    this.localStorageSettingsKey = 'undeadbytes-game';

    // Default settings
    this.settings = {
      godmode: false,
      difficulty: 'medium',
      volumes: config.volumes
    };

    this.bridge = bridge;
    this.dispatcher = dispatcher;

    if (this.bridge === 'web') {
      this.configureLocalStorage();
    } else {
      this.configureFileStorage();
      this.receiveLoadGameSavesFromBridge();
    }

    if (register) {
      this.register();
    }
  }

  register () {
    this.setVolumeSettings();
  }

  setBridge (bridge) {
    this.bridge = bridge;
  }

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

  configureFileStorage () {
    this.bridge.receive('from:settings:set', (settings) => {
      if (settings) {
        this.setSettings(settings);
        this.register();
      }
    });
  }

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

  saveLocalStorageSettings () {
    localStorage.setItem(
      this.localStorageSettingsKey,
      JSON.stringify(this.settings)
    );
  }

  saveFileSettings () {
    this.bridge.send('to:settings:save', {
      settings: this.settings
    });
  }

  receiveLoadGameSavesFromBridge () {
    this.bridge.receive('from:game:save', (save) => {
      console.log('received saved game', save);
      this.dispatcher.loadGame({ save });
    });
  }

  saveLocalStorageGame () {}

  saveFileStorageGame (game) {
    const save = {
      level: game.currentLevel,
      player: {
        pickups: {
          health: game.player.pickups.health
        }
      }
    };

    this.bridge.send('to:game:save', {
      save
    });
  }

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

  setDifficultySettings (difficulty) {
    this.difficulty = difficulty;
  }

  setGodModeSettings (godmode) {
    this.godmode = godmode;
  }

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