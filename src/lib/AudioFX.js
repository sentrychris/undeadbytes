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

const soundtrack = [
  // './soundtrack/track0.mp3',
  './soundtrack/track1.mp3',
  './soundtrack/track2.mp3',
  './soundtrack/track3.mp3',
  './soundtrack/track4.mp3',
];

export class _AudioFX
{
  /**
   * Audio FX
   */
  constructor ()
  {
    this.audio = {
      weapons: {},
      snippets: {},
    };

    // Eager load all weapon fx.
    for (const weapon of weaponMap) {
      this.audio.weapons[weapon.name] = {
        fire: new Audio(weapon.audio.fire),
        reload: new Audio(weapon.audio.reload)
      };
    }

    // Eager load all snippets.
    for (const snippet of snippets) {
      this.audio.snippets[snippet.name] = {
        types: snippet.types,
        playback: new Audio(snippet.file)
      };
    }

    this.soundtracks = [];
    this.index = 0;

    // Eager load soundtrack.
    for (const track of soundtrack) {
      this.soundtracks.push({
        name: track.split('/').pop(),
        played: false,
        playback: new Audio(track)
      });
    }

    this.track = this.soundtracks[0];
    this.nextTrackReady = false;
    this.trackListener = false;

    // Game loop playback
    this.playback = null;
  }

  /**
   * Weapon audio FX handler 
   */
  weapon ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const weapon = weaponIndex
      ? weaponMap[weaponIndex]
      : equippedWeapon;

    if (! weapon)  {
      return;
    }

    this.playback = action === 'fire'
      ? this.audio.weapons[weapon.name].fire
      : this.audio.weapons[weapon.name].reload;

    if (! this.playback) {
      return;
    }

    this.playback.volume = 0.3;

    if (weapon.audio.type !== 'repeat') {
      this.stop();
    }
    
    this.playback.playbackRate = playbackRate;
    this.playback.play();
  }

  /**
   * Snippet audio FX handler
   */
  snippet ({name = null, random = false}) {
    // Note: snippets override the current playback.
    // Do not assign snippets to the AudioFX playback
    // property as that is used by the game loop.
    this.stop();

    const snippet = random
      ? snippets[Math.floor(Math.random() * snippets.length)]
      : this.audio.snippets[name];

    if (snippet) {
      const audio = random
        ? this.audio.snippets[snippet.name]
        : snippet;
      
      audio.playback.play();
    }
  }

  /**
   * Game soundtrack
   */
  soundtrack () {
    if (this.track && (this.track.playback.paused || this.track.playback.currentTime === 0)) {
      console.log(`now playing ${this.track.name}`);
      this.track.playback.play();
    } else {
      if (this.nextTrackReady) {
        this.track.playback.pause();
        this.track.playback.currentTime = 0;

        ++this.index;
        if (this.index >= this.soundtracks.length) {
          this.index = 0 
        }

        console.log(`changed track index to ${this.index}`);

        this.trackListener = false;
        this.track = this.soundtracks[this.index];

        console.log(`selected track ${this.track.name}`);
      }
    }

    if (this.track && ! this.trackListener) {
      this.nextTrackReady = false;
      this.track.playback.addEventListener('ended', () => {
        this.nextTrackReady = true;
        this.trackListener = true;
      });
    }
  }

  /**
   * Stop game loop playback
   */
  stop () {
    if (this.playback && ! this.playback.paused) {
      this.playback.pause();
      this.playback.currentTime = 0;
    }
  }
}

export const AudioFX = new _AudioFX();