import { config } from '../../config';
import { weapons } from '../Ballistics/mappings';
import { snippets, soundtrack } from './mappings';

export class _AudioFX
{
  /**
   * Audio FX
   */
  constructor (eagerLoad = true)
  {  
    // FX
    this.audio = {
      weapons: {},
      snippets: {},
    };

    // Soundtrack
    this.soundtracks = [];
    this.loaded = false;

    if (eagerLoad) {
      // Preload all audio objects
      this.load(['weapons', 'snippets', 'soundtrack']);
    }

    // Soundtrack loop
    this.trackIndex = 0;
    this.currentTrack = this.soundtracks[this.trackIndex];
    this.nextTrackReady = false;
    this.trackListener = false;

    // FX playback loops
    this.fx = {
      weapon: null,
      snippet: null
    };

    this.volumes = config.volumes;
  }

  /**
   * Load audio objects
   * 
   * @param {*} keys 
   */
  load (keys = []) {
    if (keys.includes('weapons')) {
      for (const weapon of weapons) {
        this.audio.weapons[weapon.name] = {
          fire: new Audio(weapon.audio.fire),
          reload: new Audio(weapon.audio.reload)
        };
      }
    }

    if (keys.includes('snippets')) {
      for (const snippet of snippets) {
        if (snippet.enabled) {
          this.audio.snippets[snippet.name] = {
            types: snippet.types,
            playback: new Audio(snippet.playback)
          };
        }
      }
    }

    if (keys.includes('soundtrack')) {
      for (const track of soundtrack) {
        this.soundtracks.push({
          name: track.split('/').pop(),
          playback: new Audio(track)
        });
      }
    }

    this.loaded = true;
  }

  /**
   * Stop audio FX
   */
  stop (audio) {
    const fx = this.fx[audio];
    if (fx && ! fx.paused) {
      fx.pause();
      fx.currentTime = 0;
    }
  }

  async volume (key, level) {
    if (key === 'soundtrack') {
      this.volumes.soundtrack = level;
      if (this.currentTrack && ! this.currentTrack.playback.paused) {
        this.currentTrack.playback.volume = this.volumes.soundtrack;
      }
    }

    if (key === 'weapon') {
      this.volumes.fx.weapon = level;
      if (this.fx.weapon && ! this.fx.weapon.paused) {
        this.fx.weapon.volume = this.volumes.fx.weapon;
      }
    }

    if (key === 'snippet') {
      this.volumes.fx.snippet = level;
      if (this.fx.snippet && ! this.fx.snippet.paused) {
        this.fx.snippet.volume = this.volumes.fx.snippet;
      }
    }
  }

  /**
   * Weapon audio FX handler 
   */
  weapon ({ weaponIndex = null, equippedWeapon = null }, action = 'fire', playbackRate = 1) {
    if (! this.loaded) {
      return;
    }
  
    const weapon = weaponIndex
      ? weapons[weaponIndex]
      : equippedWeapon;

    if (! weapon)  {
      return;
    }

    this.fx.weapon = action === 'fire'
      ? this.audio.weapons[weapon.name].fire
      : this.audio.weapons[weapon.name].reload;

    if (! this.fx.weapon) {
      return;
    }

    if (weapon.audio.type !== 'repeat') {
      this.stop('weapon');
    }

    this.fx.weapon.volume = this.volumes.fx.weapon;
    this.fx.weapon.playbackRate = playbackRate;
    this.fx.weapon.play();
  }

  /**
   * Snippet audio FX handler
   */
  snippet ({name = null, random = false}, playbackRate = 1) {
    if (! this.loaded) {
      return;
    }
  
    this.stop('snippet');

    const snippet = random
      ? snippets[Math.floor(Math.random() * snippets.length)]
      : this.audio.snippets[name];

    if (snippet) {
      this.fx.snippet = random
        ? this.audio.snippets[snippet.name].playback
        : snippet.playback;
      
      this.fx.snippet.volume = this.volumes.fx.snippet;
      this.fx.weapon.playbackRate = playbackRate;
      this.fx.snippet.play();
    }
  }

  /**
   * Game soundtrack
   */
  soundtrack () {
    if (! this.loaded) {
      return;
    }

    if (this.currentTrack && this.currentTrack.playback
      && (this.currentTrack.playback.paused || this.currentTrack.playback.currentTime === 0)
    ) {
      console.log(`now playing ${this.currentTrack.name}`);
      this.currentTrack.playback.volume = this.volumes.soundtrack;
      this.currentTrack.playback.play();
    } else {
      if (this.nextTrackReady) {
        this.currentTrack.playback.pause();
        this.currentTrack.playback.currentTime = 0;

        ++this.trackIndex;
        if (this.trackIndex >= this.soundtracks.length) {
          this.trackIndex = 0; 
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
}

export const AudioFX = new _AudioFX();