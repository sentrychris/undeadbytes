import { Bullet } from './Bullet';
import { AudioHandler } from './AudioHandler';
import { mappings } from './mappings';

export class BulletFactory {
  constructor() {
    this.equippedWeapon = null;
    this.automatic = true;
    this.frames = 0;
    this.bullets = [];
    this.indexesToDelete = [];
    this.reload = false;
    this.reloadDisplay = document.querySelector('#gun-reload');
  }

  update (context, player, walls, mouse, weaponIndex = 0) {
    this.equippedWeapon = mappings[weaponIndex];
    this.setEquippedWeaponDisplayInformation();

    if (this.equippedWeapon && this.automatic && ! player.dead) {
      this.reloadDisplay.style.display = 'none';
      if (mouse.pressed) {
        this.handleFire(context, player);
      }
    } else {
      this.frames++;
      if (this.frames >= 60) {
        this.frames = 0;
        this.automatic = true;
      }
    }

    this.cleanupBullets(walls);
  }

  render () {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render();
    }
  }

  handleFire(context, player) {
    --this.equippedWeapon.clip;
    if (this.shouldReloadWeaponAmmoClip()) {
      return;
    }

    AudioHandler.play({
      equippedWeapon: this.equippedWeapon
    }, 'fire', 1.5);

    this.registerBullets(context, player);
    this.automatic = this.equippedWeapon.automatic;

    if ( ! this.automatic) {
      setTimeout(() => {
        AudioHandler.play({
          equippedWeapon: this.equippedWeapon
        }, 'reload');
      }, 900);
    }
  }

  setEquippedWeaponDisplayInformation() {
    document.querySelector('#equipped-weapon').innerHTML = this.equippedWeapon.name;
    document.querySelector('#ammo-remaining').innerHTML = this.equippedWeapon.clip;
    document.querySelector('#ammo-capacity').innerHTML = this.equippedWeapon.capacity;
  }

  shouldReloadWeaponAmmoClip() {
    if (this.equippedWeapon.clip < 0) {
      this.equippedWeapon.clip = 0;
      this.reload = true;
      this.reloadDisplay.style.display = 'inline';
      return true;
    }

    return false;
  }

  registerBullets(context, player) {
    const { spread } = this.equippedWeapon;
    for (let i = spread.min; i <= spread.max; i++) {
      const bullet = new Bullet(context, player, i);
      this.bullets.push(bullet);
    }
  }

  cleanupBullets(walls) {
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
}