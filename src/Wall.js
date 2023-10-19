import { config } from './config';

export class Wall
{
  constructor (x, y) {
    this.bounding = 'box';
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

    context.beginPath();
    context.rect(this.x, this.y, config.size, config.size);
    context.fillStyle = '#8fce00';
    context.fill();
  };
};