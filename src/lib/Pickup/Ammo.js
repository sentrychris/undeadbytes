import { Collision } from '../Entity/Collision';
import { config } from '../../config';

export class Ammo
{
  constructor (x, y) {
    this.type = 'pickup';
    this.item = 'ammo';
    this.bounding = 'arc';
    this.x = x * config.size;
    this.y = y * config.size;
    this.sleep = true;

    this.image = new Image();
    this.image.src = 'img/magazine.png';
    this.image.width = 50;

    this.glow = 40;

    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.size,
      height: config.size
    };

    this.markToDelete = false;
  }

  update (game) {
    Collision.playerToEntity(this, game, () => {
      this.pickup();
    });
  }

  render (context) {
    if (this.sleep) {
      return;
    }

    context.shadowBlur = this.glow;
    context.shadowColor = 'yellow';
    if (this.image.complete) {
      context.drawImage(this.image, this.x, this.y, 75, 75);
    } else {
      this.image.onload = () => context.drawImage(this.image, this.x, this.y, 75, 75);
    }
  }

  pickup () {
    this.markToDelete = true;
  }
}