import { Collision } from '../Collision';
import { config } from '../../config';

export class Bullet
{
  constructor (context, player, i) {
    this.vectorX = Math.cos(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);
    this.vectorY = Math.sin(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);

    // Bullet start position
    this.x = player.x + this.vectorX * config.radius * 1.5;
    this.y = player.y + this.vectorY * config.radius * 1.5;

    this.radius = 5;
    this.bounds = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  
    this.context = context;
    this.frames = 0;
    this.markToDelete = false;
  }

  update (walls, dropoff = 25) {
    this.x += this.vectorX * dropoff;
    this.y += this.vectorY * dropoff;

    this.bounds.x = this.x - this.radius;
    this.bounds.y = this.y - this.radius;

    this.frames++;

    if (this.frames > 15) {
      this.markToDelete = true;
    }

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (Collision.intersection(wall.bounds, this.bounds)) {
        this.markToDelete = true;
      }
    }

  }

  render (color) {
    if (Array.isArray(color)) {
      color = color[Math.floor(Math.random() * color.length)];
    }

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
}