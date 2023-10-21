import { mappings } from './mappings';

export class _AudioHandler
{
  play({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const config = weaponIndex
      ? mappings[weaponIndex]
      : equippedWeapon;

    if (! config)  {
      return;
    }

    const audio = action === 'fire'
      ? new Audio (config.audioFire)
      : new Audio (config.audioReload);

    if (! audio) {
      return;
    }

    if (audio.duration > 0 && !audio.paused) {
      audio.pause ();
      audio.currentTime = 0;
    }
    
    audio.playbackRate = playbackRate;
    audio.play ();
  }
}

export const AudioHandler = new _AudioHandler ();