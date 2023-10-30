import { config } from '../../config';

/**
 * Wall entity
 */
export class Wall
{
  /**
   * Create a new wall entity.
   * @param {Object} spawn - the wall spawn coordinates 
   * @param {number} spawn.x - the wall spawn x-coordinate
   * @param {number} spawn.y - the wall spawn y-coordinate
   * @param {boolean} textured - whether or not to use texture
   */
  constructor (spawn, textured = false) {
    this.type = 'wall';
    this.bounding = 'box';
    this.x = spawn.x * config.cell.size;
    this.y = spawn.y * config.cell.size;
    this.sleep = true;

    this.textured = textured;
    this.image = null;
    if (this.textured) {
      this.textured = true;
      this.image = new Image();
      this.image.src = 'img/wall.webp';
      this.image.width = config.cell.size;
      this.image.height = config.cell.size;
    }

    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.cell.size,
      height: config.cell.size
    };
  }

  /**
   * Render the wall entity on the canvas.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   */
  render (context) {
    if (this.sleep) {
      return;
    }

    context.shadowColor = '#2b2b2b';
    context.shadowBlur = 5;
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;

    if (this.textured) {
      if (this.image.complete) {
        context.drawImage(this.image, this.x, this.y, config.cell.size, config.cell.size);
      } else {
        this.image.onload = () => context.drawImage(this.image, this.x, this.y, config.cell.size, config.cell.size);
      }
    } else {
      context.beginPath();
      context.rect(this.x, this.y, config.cell.size, config.cell.size);
      context.fillStyle = '#444444';
      context.fill();  
    }
  }
}