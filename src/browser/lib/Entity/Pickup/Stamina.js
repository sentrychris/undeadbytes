import { Collision } from '../../Collision';
import { Renderer } from '../../Render/Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

/**
 * Stamina pickup item entity
 * @class
 * @category Game Entities
 * @subcategory Pickup
 */
export class Stamina
{
  /**
   * Create a new stamina pickup entity.
   * 
   * @constructor
   * @param {Object} spawn - the stamina pickup item spawn coordinates
   * @param {number} spawn.x - the stamina pickup item spawn x-coordinate
   * @param {number} spawn.y - the stamina pickup item spawn y-coordinate
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
    this.item = 'stamina';

    /**
     * value - the entity's in-game value.
     * @type {number}
     */
    this.value = config.pickups.stamina;

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
     * @type {Object}
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
    this.image.src = 'img/stamina.png';

    /**
     * glow - background glow for the entity's render image.
     * @type {number}
     */
    this.glow = 40;

    /**
     * color - background glow color for the entity's render image.
     * @type {string}
     */
    this.color = '#F5F5F5';

    /**
     * distance - the distance between the player and the entity to trigger behavior.
     * @type {number}
     */
    this.distance = 110;

    /**
     * markToDelete - determines whether the entity should be removed from the game.
     * @type {boolean}
     */
    this.markToDelete = false;
  }

  /**
   * Render the stamina pickup entity on the canvas.
   *
   * This is called every frame/repaint to render the entity. Note that this is
   * a statically-placed entity, therefore the x,y coordinates will not change on
   * update.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * 
   * @returns {void}
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the stamina pickup entity for rendering, collision and behaviour.
   * 
   * This is called every frame/repaint, upon which collision vectors are calculated to
   * determine if the player and the entity intersect, if they do, then the entity's pickup
   * method is executed as a callback.
   * 
   * @param {Game} game - the managed game instance
   * 
   * @returns {void}
   */
  update (game) {
    Collision.entityToPlayer(this, game, {
      on: this.type,
      onDistance: this.distance,
      onCallback:  () => {
        this.pickup(game);
      }
    });
  }

  /**
   * Defines the behaviour when stamina entity is picked up.
   * 
   * When the player intersects with the entity, the "inject" audio snippet will
   * play through the AudioFX handler, the player's speed will be boosted by the
   * entity value for a set number of seconds, and then the entity will be marked for
   * deletion, upon which it wil be removed from the canvas on the next frame/repaint.
   * 
   * @param {Game} game - the managed game instance
   * 
   * @returns {void}
   */
  pickup (game) {
    AudioFX.snippet({ name: 'inject' });
    game.player.boostSpeed(this.value);
    this.markToDelete = true;
  }
}