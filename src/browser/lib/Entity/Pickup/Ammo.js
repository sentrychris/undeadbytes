import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

/**
 * Ammo pickup item entity
 * @typedef {import('../../Game').Game} Game
 */
export class Ammo
{
  /**
   * Create a new ammo pickup entity.
   * @param {number} x 
   * @param {number} y 
   */
  constructor (x, y) {
    this.type = 'pickup';
    this.item = 'ammo';
    this.value = config.pickups.ammo;

    this.bounding = 'arc';
    this.x = x * config.cell.size;
    this.y = y * config.cell.size;
    
    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.cell.size,
      height: config.cell.size
    };
    
    this.sleep = true;

    this.image = new Image();
    this.image.src = 'img/magazine.png';
    this.glow = 40;
    this.color = '#F8CA00';
    this.distance = 95;

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
   * Update the ammo pickup entity for rendering, collision and behaviour.
   * @param {Game} game - the managed game instance
   */
  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup(game);
    });
  }

  /**
   * Defines the behaviour when ammo entity is picked up.
   * @param {Game} game - the managed game instance
   */
  pickup (game) {
    AudioFX.snippet({ name: 'reload' });
    game.ballistics.refillWeaponAmmoClip();
    this.markToDelete = true;
  }
}