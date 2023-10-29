import { Collision } from '../../Collision';
import { Renderer } from '../../Renderer';
import { AudioFX } from '../../Audio/AudioFX';
import { config } from '../../../config';

export class Stamina
{
  constructor (x, y) {
    this.type = 'pickup';
    this.item = 'stamina';
    this.value = config.pickups.stamina;

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
    this.image.src = 'img/stamina.png';
    this.glow = 40;
    this.color = '#F5F5F5';

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
    AudioFX.snippet({ name: 'inject' });
    game.player.boostSpeed(this.value);
    this.markToDelete = true;
  }
}