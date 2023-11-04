import { config } from '../../config';

/**
 * Wall entity
 * @class
 * @category Entity
 */
export class Wall
{
  /**
   * Create a new wall entity.
   * 
   * @constructor
   * @param {Object} spawn - the wall spawn coordinates 
   * @param {number} spawn.x - the wall spawn x-coordinate
   * @param {number} spawn.y - the wall spawn y-coordinate
   * @param {boolean} textured - whether or not to use texture
   */
  constructor (spawn, textured = false) {
    /**
     * type - the type of entity.
     * @type {string}
     */
    this.type = 'wall';

    /**
     * bounding - the entity's bounding behavior.
     * @type {string}
     */
    this.bounding = 'box';

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
     * sleep - the entity's render state.
     * @type {boolean}
     */
    this.sleep = true;

    /**
     * textured - whether or not to use textures for the wall.
     * @type {boolean}
     */
    this.textured = textured;

    /**
     * image - the image to use if textures are enabled.
     * @type {Image|null}
     */
    this.image = null;
    if (this.textured) {
      this.textured = true;
      this.image = new Image();
      this.image.src = 'img/wall.webp';
      this.image.width = config.cell.size;
      this.image.height = config.cell.size;
    }

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
  }

  /**
   * Render the wall entity on the canvas.
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