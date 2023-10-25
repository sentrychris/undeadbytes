import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../AudioFX';
import { config } from '../../../config';

export class Health
{
  constructor (x, y) {
    this.type = 'pickup';
    this.item = 'health';
    this.value = config.pickups.health;
    
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
    this.image.src = 'img/first-aid-box.png';
    this.glow = 40;
    this.color = '#6C95C2';

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
    AudioFX.snippet({ name: 'pickup' });
    this.markToDelete = true;
  }
}