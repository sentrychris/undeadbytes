import { AudioFX } from '../Audio/AudioFX';
import { Bullet } from './Bullet';
import { Grenade } from './Grenade';
import { weapons } from './mappings';

export class Ballistics
{
  constructor () {
    this.weapon = null;
    this.trigger = true;
    this.frames = 0;
    this.projectiles = [];
    this.indexesToDelete = [];
  }

  update (game) {
    this.weapon = weapons[game.selectedWeaponIndex];
    this.setEquippedWeaponDisplayInformation();

    if (this.weapon && this.trigger && ! game.player.dead) {
      document.querySelector('#out-of-ammo').style.display = 'none';

      if (game.mouse.pressed) {
        this.handleFire(game.context, game.player);
      } else {
        AudioFX.stop('weapon');
      }
    } else {
      this.frames++;
      if (this.frames >= 60) {
        this.frames = 0;
        this.trigger = true;
      }
    }

    this.cleanupProjectiles(game.walls);
  }

  render () {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].render(this.weapon.projectile.color);
    }
  }

  handleFire (context, player) {
    --this.weapon.clip.current;
    if (this.shouldReloadWeaponAmmoClip()) {
      return;
    }

    AudioFX.weapon({
      equippedWeapon: this.weapon
    }, 'fire', 1.5);

    this.registerProjectiles(context, player);
    this.trigger = this.weapon.trigger;
  }

  setEquippedWeaponDisplayInformation () {
    const { name, clip, magazines } = this.weapon;
    document.querySelector('#equipped-weapon').innerHTML = name;
    document.querySelector('#ammo-remaining').innerHTML = clip.current;
    document.querySelector('#ammo-capacity').innerHTML = clip.capacity;
    document.querySelector('#magazines-remaining').innerHTML = magazines.current;
    document.querySelector('#magazines-total').innerHTML = magazines.capacity;
  }

  shouldReloadWeaponAmmoClip () {
    if (this.weapon.clip.current <= 0) {
      if (this.weapon.magazines.current > 0) {
        --this.weapon.magazines.current;
        this.refillWeaponAmmoClip();
      } else {
        this.weapon.clip.current = 0;
        document.querySelector('#out-of-ammo').style.display = 'inline';

        return true;
      }
    }

    return false;
  }

  refillWeaponAmmoClip () {
    this.weapon.clip.current = this.weapon.clip.capacity;
  }

  registerProjectiles (context, player) {
    const { spread, delay } = this.weapon.projectile;
    for (let i = spread.min; i <= spread.max; i++) {

      const projectile = (this.weapon.type === 'throwable' && delay)
        ? new Grenade(context, player, i)
        : new Bullet(context, player, i);

      this.projectiles.push(projectile);
    }
  }

  cleanupProjectiles (walls) {
    this.indexesToDelete = [];
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].update(walls, this.weapon.projectile.dropoff);
      if (this.projectiles[i].markToDelete) {
        this.indexesToDelete.push(i);
      }
    }

    for (let i = 0; i < this.indexesToDelete.length; i++) {
      this.projectiles.splice(this.indexesToDelete[i], 1);
    }
  }
}