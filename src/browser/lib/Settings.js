import { AudioFX } from './Audio/AudioFX';
import { config } from '../config';

export class Settings
{
  constructor (bridge, { fileBasedSettings = null, register = false }) {
    this.localStorageSettingsKey = 'undeadbytes-game';

    this.settings = {
      godmode: false,
      difficulty: 'medium',
      volumes: config.volumes
    };

    this.bridge = bridge;

    if (this.bridge !== 'web') {
      this.setSettings(fileBasedSettings);
    } else {
      this.configureLocalStorage();
    }

    if (register) {
      this.register();
    }
  }

  register () {
    this.setVolumeSettings();
  }

  setSettings (settings) {
    this.settings = settings;
  }

  configureLocalStorage () {
    // Get stored settings
    const settings = JSON.parse(
      localStorage.getItem(this.localStorageSettingsKey)
    );

    if (! settings) {
      // Set defaults if there are no stored settings
      localStorage.setItem(
        this.localStorageSettingsKey,
        JSON.stringify(this.settings)
      );
    }

    // Update tracked settings
    this.setSettings(settings);
  }

  saveLocalStorageSettings () {
    localStorage.setItem(
      this.localStorageSettingsKey,
      JSON.stringify(this.settings)
    );
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
    } else {
      // ipc channel
    }

    this.setUIState('volume');
  }

  setDifficultySettings () {}

  setGodModeSettings () {}

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