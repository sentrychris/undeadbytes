import { EntityHelper } from './Entity/EntityHelper';
import { config } from '../config';

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
    this.image.src = '/img/magazine.png';
    this.image.width = 50;
    
    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.size,
      height: config.size
    };

    this.markToDelete = false;
  }

  update (game) {
    // Player-to-entity collision
    EntityHelper.playerToEntity(this, game, () => {
      this.pickup();
      console.log('picked up!');
    });
  }

  render (context) {
    if (this.sleep) {
      return;
    }

    if (this.image.complete) {
      context.drawImage(this.image, this.x, this.y, 75, 75);
    } else {
      this.image.onload = () => context.drawImage(this.image, this.x, this.y, 75, 75);
    }
  }

  pickup() {
    this.markToDelete = true;
  }
}