import { Collision } from '../Collision';
import { config } from '../../config';

/**
 * The Camera class is designed to manage the rendering and viewport of the game
 * world. It focuses on controlling the visible area based on the position of the
 * player and efficiently rendering only the visible portion of the game world.
 * @class
 * @category Game Scene
 */
export class Camera
{
  /**
   * Create new camera.
   * 
   * @constructor
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @param {number} frames - counter to control the frequency of updates
   */
  constructor (context, frames = 0) {
    /**
     * x - the camera tracking x coordinate.
     * @type {number}
     */
    this.x = 0;

    /**
     * y - the camera tracking y coordinate.
     * @type {number}
     */
    this.y = 0;

    /**
     * offsetX - the canvas x-axis offset.
     * @type {number}
     */
    this.offsetX = 0;

    /**
     * offsetY - the canvas y-axis offset.
     * @type {number}
     */
    this.offsetY = 0;

    /**
     * context - the canvas rendering context.
     * @type {CanvasRenderingContext2D}
     */
    this.context = context;

    /**
     * frames - counter to control camera updates.
     * @type {number}
     */
    this.frames = frames;

    /**
     * screen - object to represent the viewport.
     * @type {Object}
     */
    this.screen = null;
  }

  /**
   * Update the camera and rendering state for entities.
   * 
   * This method increments the frame counter and, when reaching a certain threshold,
   * calculates the new screen object based on the player's position and the canvas
   * dimensions. It checks each entity's bounding box or bounding circle against the
   * screen to determine if they are within the visible area. Entities outside the
   * visible area are flagged as sleep and not updated.
   * 
   * @param {Player} player - the player entity
   * @param {array} entities - array of game entities
   * 
   * @returns {void}
   */
  update (player, entities) {
    this.frames++;
    if (this.frames >= 15) {
      this.frames = 0;

      this.screen = {
        x: player.x - this.offsetX - this.context.canvas.width / 2 - config.cell.size,
        y: player.y - this.offsetY - this.context.canvas.height / 2 - config.cell.size,
        width: this.context.canvas.width + config.cell.size * 2,
        height: this.context.canvas.height + config.cell.size * 2
      };

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const bounds = {};

        if (entity.bounding === 'arc') {
          bounds.x = entity.x - config.cell.radius;
          bounds.y = entity.y - config.cell.radius;
          bounds.width = config.cell.radius * 2;
          bounds.height = config.cell.radius * 2;
        } else if (entity.bounding === 'box') {
          bounds.x = entity.x;
          bounds.y = entity.y;
          bounds.width = config.cell.size;
          bounds.height = config.cell.size;
        }
        entity.sleep = ! Collision.intersection(bounds, this.screen);
      }
    }
  }

  /**
   * Resize placeholder.
   * 
   * @returns {void}
   */
  resize () {}

  /**
   * Clear the rendering context to prepare for a new scene.
   * 
   * @returns {void}
   */
  newScene () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  /**
   * Adjust the camera's position based on the passed entity's position.
   * 
   * This method calculates the offset needed to center the entity on the screen
   * and applies a translation to the rendering context to simulate camera movement.
   * 
   * @param {Object} entity - the game entity (usually the player)
   * 
   * @returns {void}
   */
  preRender (entity) {
    const targetX = -entity.x + this.context.canvas.width / 2;
    const targetY = -entity.y + this.context.canvas.height / 2;

    const vectorX = targetX - this.x;
    const vectorY = targetY - this.y;

    this.offsetX = this.x - targetX;
    this.offsetY = this.y - targetY;

    this.x += vectorX / 10;
    this.y += vectorY / 10;

    this.context.save();
    this.context.translate(this.x, this.y);
  }

  /**
   * Restore the rendering context state after rendering.
   * 
   * @returns {void}
   */
  postRender () {
    this.context.restore();
  }
}