import { AudioFX } from './Audio/AudioFX';
import { config } from '../config';

export class Settings
{
  constructor (bridge, game, { settings = null, register = false }) {
    this.settings = {
      godmode: false,
      difficulty: 'medium',
      volumes: config.volumes
    };

    console.log(this.settings);

    this.game = game;

    if (bridge !== 'web') {
      this.setSettings(settings);
    } else {
      this.setLocalStorageSettings();
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

  setLocalStorageSettings () {
    this.settings = JSON.parse(
      localStorage.getItem('undeadbytes-game-')
    );
  }

  setVolumeSettings (volume) {
    if (volume.fx && volume.fx.weapon) {
      AudioFX.volume('weapon', volume.fx.weapon);
    }

    if (volume.fx && volume.fx.snippet) {
      AudioFX.volume('snippet', volume.fx.snippet);
    }

    if (volume.soundtrack) {
      AudioFX.volume('soundtrack', volume.soundtrack);
    }

    this.setState('volume');
  }

  setDifficultySettings () {}

  setGodModeSettings () {}

  setState (key) {
    if (key === 'volume') {
      const targets = document.querySelectorAll('.volume-slider');
      if (targets) {
        for (const target of targets) {
          const { control } = target.dataset;
          if (['weapon', 'snippet'].includes(control)) {
            target.value = this.settings.volumes.fx[control];
          } else {
            target.value = this.settings.volumes[control];
          }
        }
      }
    }
  }
}