import { config } from '../config';
import { EntityCollision } from './Entity/EntityCollision';
import { EntityHelper } from './Entity/EntityHelper';

export class Ammo
{
  constructor (x, y) {
    this.type = 'pickup';
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

    this.markToDelete = false;
  }

  update (game) {
    // Determine the next x,y position vectors based on the distance
    // between the player and the enemy's current x,y position.
    let vectorX = game.player.x - this.x;
    let vectorY = game.player.y - this.y;

    if (game.player.dead) {
      // If the player is dead, set the enemy's x,y position to their
      // last known position.
      vectorX = this.lastVectorX;
      vectorY = this.lastVectorY;
    } else {
      // Otherwise update their last known position with the newly
      // determined x,y position.
      this.lastVectorX = vectorX;
      this.lastVectorY = vectorY;
    }

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

    const radius = config.radius/2;
    const gradient = context.createRadialGradient(this.x, this.y, radius/2, this.x, this.y, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'red');

    context.beginPath();
    context.arc(this.x, this.y, config.radius/2, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
  }

  pickup() {
    this.markToDelete = true;
  }
}