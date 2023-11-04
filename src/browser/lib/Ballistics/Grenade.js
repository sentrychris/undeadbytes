import { Collision } from '../Collision';
import { config } from '../../config';

/**
 * Grenade projectile handler.
 * @class
 * @category Game Ballistics
 */
export class Grenade
{
  /**
   * Create new grenade projectile.
   * 
   * @constructor
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @param {Player} player - the player entity
   * @param {number} i - grenade projectile spread index
   */
  constructor (context, player, i) {
    /**
     * vectorX - the projectile vector x-coordinate
     * @type {number}
     */
    this.vectorX = Math.cos(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);

    /**
     * vectorY - the projectile vector y-coordinate
     * @type {number}
     */
    this.vectorY = Math.sin(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);

    /**
     * x - the projectile current x-coordinate
     * @type {number}
     */
    this.x = player.x + this.vectorX * config.cell.radius * 1.5;

    /**
     * y - the projectile current y-coordinate
     * @type {number}
     */
    this.y = player.y + this.vectorY * config.cell.radius * 1.5;

    /**
     * radius - the rendered projectile radius size
     * @type {number}
     */
    this.radius = 5;

    /**
     * bounds - the entity's bounds for intersection.
     * @type {Object}
     */
    this.bounds = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  
    /**
     * context - the canvas rendering context
     * @type {CanvasRenderingContext2D}
     */
    this.context = context;

    /**
     * frames - counter to control the rendering/update frequency
     * @type {number}
     */
    this.frames = 0;

    /**
     * markToDelete - determines whether or not the grenade should be rendered/updated
     * @type {boolean}
     */
    this.markToDelete = false;
  }

  /**
   * Render the grenade projectile on the canvas.
   * 
   * This is called every frame/repaint to render the bullet. Note that this
   * is an animated entity, therefore the x,y coordinates will change on update.
   * 
   * @param {array|string} color - the color of the projectile.
   * 
   * @returns {void}
   */
  render (color) {
    if (Array.isArray(color)) {
      color = color[Math.floor(Math.random() * color.length)];
    }

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
  
  /**
   * Update the projectile data for bounds tracking, collision and cleanup.
   * 
   * Updates the grenade's x,y coordinates depending on the vector coordinates and projectile
   * dropoff value, checks frames to ensure the grenade should remain active, and checks for
   * collision against walls to determine if the grenade should remain active. This is called
   * every frame/repaint.
   * 
   * @param {Wall[]} walls - the rendered walls
   * @param {number} dropoff - the projectile dropoff rate
   * 
   * @returns {void}
   */
  update (walls, dropoff = 25) {
    this.x += this.vectorX * dropoff;
    this.y += this.vectorY * dropoff;

    this.bounds.x = this.x - this.radius;
    this.bounds.y = this.y - this.radius;

    this.frames++;

    if (this.frames > 15) {
      this.markToDelete = true;
    }

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (Collision.intersection(wall.bounds, this.bounds)) {
        this.markToDelete = true;
      }
    }

  }
}