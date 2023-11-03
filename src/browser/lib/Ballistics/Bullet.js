import { Collision } from '../Collision';
import { config } from '../../config';

/**
 * Bullet projectile handler.
 */
export class Bullet
{
  /**
   * Create new bullet projectile.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @param {Player} player - the player entity
   * @param {number} i - bullet projectile spread index
   */
  constructor (context, player, i) {
    this.vectorX = Math.cos(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);
    this.vectorY = Math.sin(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);

    // Projectile position
    this.x = player.x + this.vectorX * config.cell.radius * 1.5;
    this.y = player.y + this.vectorY * config.cell.radius * 1.5;

    this.radius = 5;
    this.bounds = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  
    this.context = context;
    this.frames = 0;
    this.markToDelete = false;
  }

  /**
   * Update the projectile data for bounds tracking, collision and cleanup.
   * @param {Wall[]} walls - the rendered walls
   * @param {number} dropoff - the projectile dropoff rate
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

  /**
   * Render the bullet projectile on the canvas.
   * @param {array|string} color - the color of the projectile.
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
}