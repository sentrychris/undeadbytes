import { config } from '../../config';

export class Wall
{
  constructor (x, y, textured = false) {
    this.type = 'wall';
    this.bounding = 'box';
    this.x = x * config.cell.size;
    this.y = y * config.cell.size;
    this.sleep = true;

    this.textured = textured;
    this.image = null;
    if (this.textured) {
      this.textured = true;
      this.image = new Image();
      this.image.src = 'img/wall.png';
      this.image.width = config.cell.size;
      this.image.height = config.cell.size;
    }

    this.bounds = {
      x: this.x,
      y: this.y,
      width: config.cell.size,
      height: config.cell.size
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
        context.drawImage(this.image, this.x, this.y, config.cell.size, config.cell.size);
      } else {
        this.image.onload = () => context.drawImage(this.image, this.x, this.y, config.cell.size, config.cell.size);
      }
    } else {
      context.beginPath();
      context.rect(this.x, this.y, config.cell.size, config.cell.size);
      context.fillStyle = '#444444';
      context.fill();  
    }
  }
}