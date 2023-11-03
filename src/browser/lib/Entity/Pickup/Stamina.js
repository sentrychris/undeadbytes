import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

/**
 * Stamina pickup item entity
 */
export class Stamina
{
  /**
   * Create a new stamina pickup entity.
   * @param {Object} spawn - the stamina pickup item spawn coordinates
   * @param {number} spawn.x - the stamina pickup item spawn x-coordinate
   * @param {number} spawn.y - the stamina pickup item spawn y-coordinate
   */
  constructor (spawn) {
    this.type = 'pickup';
    this.item = 'stamina';
    this.value = config.pickups.stamina;

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
    this.image.src = 'img/stamina.png';
    this.glow = 40;
    this.color = '#F5F5F5';
    this.distance = 100;

    this.markToDelete = false;
  }

  /**
   * Render the stamina pickup entity on the canvas.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the stamina pickup entity for rendering, collision and behaviour.
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
    game.player.boostSpeed(this.value);
    this.markToDelete = true;
  }
}