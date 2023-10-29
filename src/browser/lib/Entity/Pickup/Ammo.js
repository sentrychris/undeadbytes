import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

export class Ammo
{
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

  render (context) {
    Renderer.render(this, context);
  }

  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup(game);
    });
  }

  pickup (game) {
    AudioFX.snippet({ name: 'reload' });
    game.ballistics.refillWeaponAmmoClip();
    this.markToDelete = true;
  }
}