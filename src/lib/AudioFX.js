import { mappings as weaponMap } from './Ballistics/mappings';

export class _AudioFX
{
  constructor ()
  {
    this.audio = {
      weapons: {}
    };

    // Eager load all weapon fx.
    for (const weapon of weaponMap) {
      this.audio.weapons[weapon.name] = {
        fire: new Audio(weapon.audio.fire),
        reload: new Audio(weapon.audio.reload)
      };
    }

    this.playback = null;
  }

  weapon ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const config = weaponIndex
      ? weaponMap[weaponIndex]
      : equippedWeapon;

    if (! config)  {
      return;
    }

    this.playback = action === 'fire'
      ? this.audio.weapons[config.name].fire
      : this.audio.weapons[config.name].reload;

    if (! this.playback) {
      return;
    }

    this.playback.volume = 0.3;

    if (config.audio.type !== 'repeat') {
      this.stop();
    }
    
    this.playback.playbackRate = playbackRate;
    this.playback.play();
  }

  stop () {
    if (this.playback && ! this.playback.paused) {
      this.playback.pause();
      this.playback.currentTime = 0;
    }
  }
}

export const AudioFX = new _AudioFX();