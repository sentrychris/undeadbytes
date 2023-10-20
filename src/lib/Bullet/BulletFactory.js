import { Bullet } from './Bullet';
import { mappings } from './mappings';

export class BulletFactory {
  constructor() {
    this.equippedWeapon = null;
    this.reload = false;
    this.automatic = true;
    this.frames = 0;
    this.bullets = [];
    this.indexesToDelete = [];
  }

  update (context, player, walls, mouse, weaponIndex = 0) {
    this.equippedWeapon = mappings[weaponIndex];
    document.querySelector('strong#equipped-weapon').innerHTML = this.equippedWeapon.name;
    document.querySelector('span#ammo-remaining').innerHTML = this.equippedWeapon.clip;
    document.querySelector('span#ammo-capacity').innerHTML = this.equippedWeapon.capacity;

    if (this.equippedWeapon && this.automatic && !player.dead) {
      if (mouse.pressed) {
        --this.equippedWeapon.clip;
        if (this.equippedWeapon.clip < 0) {
          this.equippedWeapon.clip = 0;
          this.reload = true;
          document.querySelector('#gun-reload').style.display = 'inline';
          return;
        }

        document.querySelector('#gun-reload').style.display = 'none';

        const audioFire = document.querySelector(`#${this.equippedWeapon.audioFire}`);
        if (audioFire) {
          if (audioFire.duration > 0 && !audioFire.paused) {
            audioFire.pause();
            audioFire.currentTime = 0
          }
          audioFire.playbackRate=1.5
          audioFire.play();
        }

        const { spread } = this.equippedWeapon;
        for (let i = spread.min; i <= spread.max; i++) {
          const bullet = new Bullet(context, player, i);
          this.bullets.push(bullet);
        }

        this.automatic = this.equippedWeapon.automatic;

        setTimeout(() => {
          const audioReload = document.querySelector(`#${this.equippedWeapon.audioReload}`);
          if (audioReload) {
            audioReload.play();
          }
        }, 900);
      }
    } else {
      this.frames++;
      if (this.frames >= 60) {
        this.frames = 0;
        this.automatic = true;
      }
    }

    this.indexesToDelete = [];
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update(walls);
      if (this.bullets[i].markToDelete) {
        this.indexesToDelete.push(i);
      }
    }

    for (let i = 0; i < this.indexesToDelete.length; i++) {
      this.bullets.splice(this.indexesToDelete[i], 1);
    }
  }

  render () {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render();
    }
  }
}