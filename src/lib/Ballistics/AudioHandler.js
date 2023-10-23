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
  }

  play ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const config = weaponIndex
      ? mappings[weaponIndex]
      : equippedWeapon;

    if (! config)  {
      return;
    }

    const audio = action === 'fire'
      ? this.audio[config.name].fire
      : this.audio[config.name].reload;

    if (! audio) {
      return;
    }

    if (audio.duration > 0 && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    audio.playbackRate = playbackRate;
    audio.play();
  }
}

export const AudioHandler = new _AudioHandler();