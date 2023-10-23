import { EntityHelper } from './Entity/EntityHelper';
import { config } from '../config';
import { randomNumber } from '../util';

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
    this.image.src = 'https://sentrychris.github.io/squareshoot/img/magazine.png';
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
    // Player-to-entity collision
    EntityHelper.playerToEntity(this, game, () => {
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

    // this.glow = this.glow === 40 ? 20 : 40;
  }

  pickup() {
    this.markToDelete = true;
  }
}