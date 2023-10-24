import { Calculator } from '../Entity/Calculator';
import { config } from '../../config';

export class Camera
{
  constructor (context, frames = 0) {
    this.x = 0;
    this.y = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.context = context;
    this.frames = frames;
  }

  update (player, entities) {
    this.frames++;
    if (this.frames >= 15) {
      this.frames = 0;

      const screen = {
        x: player.x - this.offsetX - this.context.canvas.width / 2 - this.size,
        y: player.y - this.offsetY - this.context.canvas.height / 2 - this.size,
        width: this.context.canvas.width + this.size * 2,
        height: this.context.canvas.height + this.size * 2
      };

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const bounds = {};

        if (entity.bounding === 'arc') {
          bounds.x = entity.x - config.radius;
          bounds.y = entity.y - config.radius;
          bounds.width = config.radius * 2;
          bounds.height = config.radius * 2;
        } else if (entity.bounding === 'box') {
          bounds.x = entity.x;
          bounds.y = entity.y;
          bounds.width = config.size;
          bounds.height = config.size;
        }
        entity.sleep = ! Calculator.intersection(bounds, screen);
      }
    }
  }

  resize () {}

  preRender (player) {
    const targetX = -player.x + this.context.canvas.width / 2;
    const targetY = -player.y + this.context.canvas.height / 2;

    const vectorX = targetX - this.x;
    const vectorY = targetY - this.y;

    this.offsetX = this.x - targetX;
    this.offsetY = this.y - targetY;

    this.x += vectorX / 10;
    this.y += vectorY / 10;

    this.context.save();
    this.context.translate(this.x, this.y);
  }

  postRender () {
    this.context.restore();
  }
}