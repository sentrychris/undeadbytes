import { AudioFX } from '../Audio/AudioFX';
import { Bullet } from './Bullet';
import { Grenade } from './Grenade';
import { weapons } from './mappings';

/**
 * Ballistics handler.
 * @class
 * @category Game Ballistics
 */
export class Ballistics
{
  /**
   * Create new Ballistics handler
   */
  constructor () {

    /**
     * weapon - the equipped weapon
     * @type {Object}
     */
    this.weapon = null;

    /**
     * trigger - determines whether or not the weapon is triggered
     * @type {Object}
     */
    this.trigger = true;

    /**
     * frames - counter to control the update frequency for weapon actions
     * @type {number}
     */
    this.frames = 0;

    /**
     * projectiles - array of tracked projectiles currently on canvas
     * @type {array}
     */
    this.projectiles = [];

    /**
     * indexesToDelete - indexes of various projectile entities to remove
     * @type {array}
     */
    this.indexesToDelete = [];
  }

  /**
   * Render ballistics projectiles.
   * 
   * This is called every frame/repaint to render projectiles. Note that
   * projectiles are an animated entities, therefore their x,y coordinates
   * will change on update.
   * 
   * @returns {void}
   */
  render () {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].render(this.weapon.projectile.color);
    }
  }

  /**
   * Update game ballistics data, handle weapon triggering and projectile cleanup.
   * 
   * Checks the weapon state, sets the weapon stats, handles tiggered weapon actions
   * and audio. This is called every frame/repaint.
   * 
   * @param {Game} game - the managed game instance
   * 
   * @returns {void}
   */
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

  /**
   * Handle weapon fire.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @param {Player} player - the player entity
   * 
   * @returns {void}
   */
  handleFire (context, player) {
    if (this.shouldReloadWeaponAmmoClip()) {
      return;
    }

    --this.weapon.clip.current;

    AudioFX.weapon({
      equippedWeapon: this.weapon
    }, 'fire', 1.5);

    this.registerProjectiles(context, player);
    this.trigger = this.weapon.trigger;
  }

  /**
   * Set equippred weapon display information e.g. ammo, magazines.
   * 
   * @returns {void}
   */
  setEquippedWeaponDisplayInformation () {
    const { name, clip, magazines } = this.weapon;
    document.querySelector('#equipped-weapon').innerHTML = name;
    document.querySelector('#ammo-remaining').innerHTML = clip.current;
    document.querySelector('#ammo-capacity').innerHTML = clip.capacity;
    document.querySelector('#magazines-remaining').innerHTML = magazines.current;
    document.querySelector('#magazines-total').innerHTML = magazines.capacity;
  }

  /**
   * Determine if weapon needs to be reloaded and handle accordingly.
   * 
   * @returns {boolean}
   */
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

  /**
   * Refill the curren ammo clip or replenish magazines.
   * 
   * @returns {void}
   */
  refillWeaponAmmoClip () {
    if (this.weapon.clip.current === this.weapon.clip.capacity) {
      if (this.weapon.magazines.current < this.weapon.magazines.capacity) {
        ++this.weapon.magazines.current;
      }
    } else {
      this.weapon.clip.current = this.weapon.clip.capacity;
    }
  }

  /**
   * Register bullet projectiles for rendering and collision.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @param {Player} player - the player entity
   * 
   * @returns {void}
   */
  registerProjectiles (context, player) {
    const { spread, delay } = this.weapon.projectile;
    for (let i = spread.min; i <= spread.max; i++) {

      const projectile = (this.weapon.type === 'throwable' && delay)
        ? new Grenade(context, player, i)
        : new Bullet(context, player, i);

      this.projectiles.push(projectile);
    }
  }

  /**
   * Clean up handled projectiles to stop rendering and updates.
   * 
   * @param {Wall[]} walls - the rendered walls
   * 
   * @returns {void}
   */
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