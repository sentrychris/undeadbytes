import { mappings as weapons } from './Ballistics/mappings';

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
  './soundtrack/track0.mp3',
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
  constructor (eagerLoad = true)
  {
    this.audio = {
      weapons: {},
      snippets: {},
    };

    this.soundtracks = [];

    if (eagerLoad) {
      this.load(['weapons', 'snippets', 'soundtrack']);
    }

    this.trackIndex = 0;
    this.currentTrack = this.soundtracks[this.trackIndex];
    this.nextTrackReady = false;
    this.trackListener = false;

    // FX playback loop
    this.playback = null;
  }

  /**
   * Weapon audio FX handler 
   */
  weapon ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    const weapon = weaponIndex
      ? weapons[weaponIndex]
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
    if (this.currentTrack && this.currentTrack.playback
      && (this.currentTrack.playback.paused || this.currentTrack.playback.currentTime === 0)
    ) {
      console.log(`now playing ${this.currentTrack.name}`);
      this.currentTrack.playback.play();
    } else {
      if (this.nextTrackReady) {
        this.currentTrack.playback.pause();
        this.currentTrack.playback.currentTime = 0;

        ++this.trackIndex;
        if (this.trackIndex >= this.soundtracks.length) {
          this.trackIndex = 0 
        }

        console.log(`changed track index to ${this.trackIndex}`);

        this.trackListener = false;
        this.currentTrack = this.soundtracks[this.trackIndex];
      }
    }

    if (this.currentTrack && ! this.trackListener) {
      this.nextTrackReady = false;
      this.currentTrack.playback.addEventListener('ended', () => {
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

  /**
   * Load audio objects
   * 
   * @param {*} keys 
   */
  load(keys = []) {
    if (keys.includes('weapons')) {
      // Eager load all weapon fx.
      for (const weapon of weapons) {
        this.audio.weapons[weapon.name] = {
          fire: new Audio(weapon.audio.fire),
          reload: new Audio(weapon.audio.reload)
        };
      }
    }

    if (keys.includes('snippets')) {
      // Eager load all snippets.
      for (const snippet of snippets) {
        this.audio.snippets[snippet.name] = {
          types: snippet.types,
          playback: new Audio(snippet.file)
        };
      }
    }

    if (keys.includes('soundtrack')) {
      // Eager load soundtrack.
      for (const track of soundtrack) {
        this.soundtracks.push({
          name: track.split('/').pop(),
          played: false,
          playback: new Audio(track)
        });
      }
    }
  }
}

export const AudioFX = new _AudioFX();