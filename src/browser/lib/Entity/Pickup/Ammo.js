import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

/**
 * Ammo pickup item entity
 */
export class Ammo
{
  /**
   * Create a new ammo pickup entity.
   * @param {Object} spawn - the ammo pickup item spawn coordinates
   * @param {number} spawn.x - the ammo pickup item spawn x-coordinate
   * @param {number} spawn.y - the ammo pickup item spawn y-coordinate
   */
  constructor (spawn) {
    /**
     * type - the type of entity.
     * @type {string}
     * @public
     */
    this.type = 'pickup';

    /**
     * item - the entity item.
     * @type {number}
     * @public
     */
    this.item = 'ammo';

    /**
     * value - the entity's in-game value.
     * @type {number}
     * @public
     */
    this.value = config.pickups.ammo;

    /**
     * bounding - the entity's bounding behavior.
     * @type {string}
     * @public
     */
    this.bounding = 'arc';

    /**
     * x - the entity's x coordinate.
     * @type {number}
     * @public
     */
    this.x = spawn.x * config.cell.size;

    /**
     * y - the entity's y coordinate.
     * @type {number}
     * @public
     */
    this.y = spawn.y * config.cell.size;
    

    /**
     * bounds - the entity's bounds for intersection.
     * @type {object}
     * @public
     */
    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.cell.size,
      height: config.cell.size
    };
    

    /**
     * sleep - the entity's render state.
     * @type {boolean}
     * @public
     */
    this.sleep = true;


    /**
     * image - the entity's render image.
     * @type {Image}
     * @public
     */
    this.image = new Image();
    this.image.src = 'img/magazine.png';

    /**
     * glow - background glow for the entity's render image.
     * @type {number}
     * @public
     */
    this.glow = 40;

    /**
     * color -background glow color for the entity's render image.
     * @type {string}
     * @public
     */
    this.color = '#F8CA00';

    /**
     * distance - the distance between the player and the entity to trigger behavior.
     * @type {number}
     * @public
     */
    this.distance = 95;

    /**
     * markToDelete - determines whether the entity should be removed from the game.
     * @type {boolean}
     * @public
     */
    this.markToDelete = false;
  }

  /**
   * Render the ammo pickup entity on the canvas.
   * @param {CanvasRenderingContext2D} context 
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the ammo pickup entity on each frame for rendering, collision and behaviour.
   * @param {Game} game - the managed game instance
   */
  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup(game);
    });
  }

  /**
   * Defines the behaviour to triggger when the player intersects with the entity.
   * @param {Game} game - the managed game instance
   */
  pickup (game) {
    AudioFX.snippet({ name: 'reload' });
    game.ballistics.refillWeaponAmmoClip();
    this.markToDelete = true;
  }
}