import { config } from '../config';

export class Wall
{
  constructor (x, y, textured = false) {
    this.bounding = 'box';
    this.x = x * config.size;
    this.y = y * config.size;
    this.sleep = true;

    this.textured = textured;
    this.image = null;
    if (this.textured) {
      this.textured = true;
      this.image = new Image();
      this.image.src = 'https://sentrychris.github.io/squareshoot/img/wall.png';
      this.image.width = config.size;
      this.image.height = config.size;
    }

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

    context.shadowColor = '#2b2b2b';
    context.shadowBlur = 5;
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;

    if (this.textured) {
      if (this.image.complete) {
        context.drawImage(this.image, this.x, this.y, config.size, config.size);
      } else {
        this.image.onload = () => context.drawImage(this.image, this.x, this.y, config.size, config.size);
      }
    } else {
      context.beginPath();
      context.rect(this.x, this.y, config.size, config.size);
      context.fillStyle = '#444444';
      context.fill();  
    }
  }
}