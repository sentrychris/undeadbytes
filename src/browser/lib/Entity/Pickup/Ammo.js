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
     */
    this.type = 'pickup';

    /**
     * item - the entity item.
     * @type {number}
     */
    this.item = 'ammo';

    /**
     * value - the entity's in-game value.
     * @type {number}
     */
    this.value = config.pickups.ammo;

    /**
     * bounding - the entity's bounding behavior.
     * @type {string}
     */
    this.bounding = 'arc';

    /**
     * x - the entity's x coordinate.
     * @type {number}
     */
    this.x = spawn.x * config.cell.size;

    /**
     * y - the entity's y coordinate.
     * @type {number}
     */
    this.y = spawn.y * config.cell.size;
    

    /**
     * bounds - the entity's bounds for intersection.
     * @type {object}
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
     */
    this.sleep = true;


    /**
     * image - the entity's render image.
     * @type {Image}
     */
    this.image = new Image();
    this.image.src = 'img/magazine.png';

    /**
     * glow - background glow for the entity's render image.
     * @type {number}
     */
    this.glow = 40;

    /**
     * color - background glow color for the entity's render image.
     * @type {string}
     */
    this.color = '#F8CA00';

    /**
     * distance - the distance between the player and the entity to trigger behavior.
     * @type {number}
     */
    this.distance = 95;

    /**
     * markToDelete - determines whether the entity should be removed from the game.
     * @type {boolean}
     */
    this.markToDelete = false;
  }

  /**
   * Render the ammo pickup entity on the canvas.
   * 
   * This is called every frame/repaint to render the entity. Note that this is
   * a statically-placed entity, therefore the x,y coordinates will not change on
   * update.
   * 
   * @param {CanvasRenderingContext2D} context
   * @returns {void}
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the ammo pickup entity on each frame for rendering, collision and behaviour.
   * 
   * This is called every frame/repaint, upon which collision vectors are calculated to
   * determine if the player and the entity intersect, if they do, then the entity's pickup
   * method is executed as a callback.
   * 
   * @param {Game} game - the managed game instance
   * @returns {void}
   */
  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup(game);
    });
  }

  /**
   * Defines the behaviour to triggger when the player intersects with the entity.
   * 
   * When the player intersects with the entity, the "reload" audio snippet will
   * play through the AudioFX handler, the player's ammo or magazines will be
   * replenished through the Ballistics handler, and then the entity will be
   * marked for deletion, upon which it wil be removed from the canvas on the next
   * frame/repaint.
   * 
   * @param {Game} game - the managed game instance
   * @returns {void}
   */
  pickup (game) {
    AudioFX.snippet({ name: 'reload' });
    game.ballistics.refillWeaponAmmoClip();
    this.markToDelete = true;
  }
}