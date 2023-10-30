import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

/**
 * Health pickup item entity
 * @typedef {import('../../Game').Game} Game
 */
export class Health
{
  /**
   * Create a new health pickup entity.
   * @param {Object} spawn - the health pickup item spawn coordinates
   * @param {number} spawn.x - the health pickup item spawn x-coordinate
   * @param {number} spawn.y - the health pickup item spawn y-coordinate
   */
  constructor (spawn) {
    this.type = 'pickup';
    this.item = 'health';
    this.value = config.pickups.health;
    
    this.bounding = 'arc';
    this.x = spawn.x * config.cell.size;
    this.y = spawn.y * config.cell.size;
    
    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.cell.size,
      height: config.cell.size
    };

    this.sleep = true;

    this.image = new Image();
    this.image.src = 'img/first-aid-box.png';
    this.glow = 40;
    this.color = '#6C95C2';
    this.distance = 100; // depending on the size of the image asset, the distance-to-pickup might need to be tweaked

    this.markToDelete = false;
  }

  /**
   * Render the health pickup entity on the canvas.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the health pickup entity for rendering, collision and behaviour.
   * @param {Game} game - the managed game instance
   */
  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup(game);
    });
  }

  /**
   * Defines the behaviour when health entity is picked up.
   * @param {Game} game - the managed game instance
   */
  pickup (game) {
    AudioFX.snippet({ name: 'inject' });
    game.player.refillHealth(this.value, true);
    this.markToDelete = true;
  }
}