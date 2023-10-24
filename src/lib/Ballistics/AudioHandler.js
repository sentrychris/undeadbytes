import { mappings } from './mappings';

export class _AudioHandler
{
  constructor()
  {
    this.audio = {};
    // Eager load all audio files.
    for (const weapon of mappings) {
      this.audio[weapon.name] = {
        fire: new Audio(weapon.audioFire),
        reload: new Audio(weapon.audioReload)
      }
    }

    this.playback = null;
  }

  play ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const config = weaponIndex
      ? mappings[weaponIndex]
      : equippedWeapon;

    if (! config)  {
      return;
    }

    this.playback = action === 'fire'
      ? this.audio[config.name].fire
      : this.audio[config.name].reload;

    if (! this.playback) {
      return;
    }

    this.playback.volume = 0.6;

    if (config.audioType !== 'repeat') {
      this.stop();
    }
    
    this.playback.playbackRate = playbackRate;
    this.playback.play();
  }

  stop() {
    if (this.playback && ! this.playback.paused) {
      this.playback.pause();
      this.playback.currentTime = 0;
    }
  }
}

export const AudioHandler = new _AudioHandler();