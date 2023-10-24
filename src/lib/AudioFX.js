import { mappings as weaponMap } from './Ballistics/mappings';


const snippets = [
  {
    name: 'lilbitch',
    types: ['passed', 'kill'],
    file: './fx/audio/snippets/lilbitch.mp3'
  },
  {
    name: 'bloodyshoes',
    types: ['passed', 'kill'],
    file: './fx/audio/snippets/bloodyshoes.mp3'
  },
  {
    name: 'nofucks',
    types: ['passed', 'kill'],
    file: './fx/audio/snippets/nofucks.mp3'
  },
  {
    name: 'eoww',
    types: ['hurt', 'kill'],
    file: './fx/audio/snippets/eoww.mp3'
  },
];

export class _AudioFX
{
  constructor ()
  {
    this.audio = {
      weapons: {},
      snippets: {}
    };

    // Eager load all weapon fx.
    for (const weapon of weaponMap) {
      this.audio.weapons[weapon.name] = {
        fire: new Audio(weapon.audio.fire),
        reload: new Audio(weapon.audio.reload)
      };
    }

    for (const snippet of snippets) {
      this.audio.snippets[snippet.name] = {
        types: snippet.types,
        playback: new Audio(snippet.file)
      }
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

  snippet ({name = null, random = false}) {
    // Note: snippets override the current playback.
    // Do not assign snippets to the AudioFX playback
    // property as that is used by the game loop.
    this.stop();

    const { snippets } = this.audio;
    const snippet = random
      ? snippets[Object.keys(snippets[Math.floor(Math.random() * length)])]
      : snippets[name];

    if (snippet) {
      snippet.playback.play();
    }
  }

  stop () {
    if (this.playback && ! this.playback.paused) {
      this.playback.pause();
      this.playback.currentTime = 0;
    }
  }
}

export const AudioFX = new _AudioFX();