import { config } from '../config';
import { EntityCollision } from './Entity/EntityCollision';
import { EntityHelper } from './Entity/EntityHelper';

export class Ammo
{
  constructor (x, y) {
    this.bounding = 'arc';
    this.x = x * config.size;
    this.y = y * config.size;
    this.sleep = true;

    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.size,
      height: config.size
    };
  }

  render (context) {
    if (this.sleep) {
      return;
    }

    const radius = config.radius/2;
    const gradient = context.createRadialGradient(this.x, this.y, radius/2, this.x, this.y, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'red');

    context.beginPath();
    context.arc(this.x, this.y, config.radius/2, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
  }

  pickup(game) {
    if (EntityHelper.intersection(game.player, this)) {
      // Pickup logic here.
    } else {
      // ignore bounds check.
    }
  }
}