import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { config } from '../../../config';

export class Ammo
{
  constructor (x, y) {
    this.type = 'pickup';
    this.item = 'ammo';
    this.value = false;

    this.bounding = 'arc';
    this.x = x * config.size;
    this.y = y * config.size;
    
    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.size,
      height: config.size
    };
    
    this.sleep = true;

    this.image = new Image();
    this.image.src = 'img/magazine.png';
    this.image.width = 50;
    this.glow = 40;
    this.color = '#F8CA00'

    this.markToDelete = false;
  }

  render (context) {
    Renderer.render(this, context);
  }

  update (game) {
    Collision.entityToPlayer(this, game, () => {
      this.pickup();
    });
  }

  pickup () {
    this.markToDelete = true;
  }
}