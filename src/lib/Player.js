
import { EntityCollision } from './Entity/EntityCollision';
import { EntityHelper } from './Entity/EntityHelper';
import { config } from '../config';

export class Player
{
  constructor (spawn) {
    this.type = 'player';
    this.bounding = 'arc';
    this.x = spawn.x * config.size;
    this.y = spawn.y * config.size;
    this.angle = 0;
    this.position = 0;
    this.incrementer = 0;
    this.speed = 5;
    
    this.sleep = true;
    
    this.invincible = false;
    this.health = 100;
    
    this.damage = {
      x: 0,
      y: 0
    };
    this.dead = false;
  }

  takeDamage (enemy) {
    if (! this.invincible) {
      const vectorX = this.x - enemy.x;
      const vectorY = this.y - enemy.y;
      const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

      if (length > 0) {
        this.damage.x = vectorX / length * 20;
        this.damage.y = vectorY / length * 20;
        this.invincible = true;
        
        this.health -= 25; // TODO difficulty setting and power-ups
        this.health = this.health < 0 ? 0 : this.health;

        if (this.health == 0) {
          this.dead = true;
        }
      }
    }
  }

  update (game) {
    if (this.sleep || this.dead) {
      return;
    }

    let count = 0;
    count += game.keyboard.up ? 1 : 0;
    count += game.keyboard.down ? 1 : 0;
    count += game.keyboard.left ? 1 : 0;
    count += game.keyboard.right ? 1 : 0;

    let currentSpeed = this.speed;

    if (count > 1) {
      currentSpeed /= Math.sqrt(2);
    }

    // keyboard
    if (Math.abs(this.damage.x) != 0 < Math.abs(this.damage.y) != 0) {
      this.damage.x *= 0.9;
      this.damage.y *= 0.9;

      this.x += this.damage.x;
      this.y += this.damage.y;

      if (Math.abs(this.damage.x) < 0.5 && Math.abs(this.damage.y) < 0.5) {
        this.damage = {
          x: 0,
          y: 0
        };

        this.invincible = false;
      }
    } else {
      if (game.keyboard.up) this.y -= currentSpeed;
      if (game.keyboard.down) this.y += currentSpeed;
      if (game.keyboard.left) this.x -= currentSpeed;
      if (game.keyboard.right) this.x += currentSpeed;
    }

    // collision
    const collisionVector = EntityCollision.vector(this.x, this.y, game.walls);
    this.x += collisionVector.x * currentSpeed;
    this.y += collisionVector.y * currentSpeed;

    // mouse
    let vectorX = game.camera.offsetX + game.context.canvas.width / 2 - game.mouse.x;
    let vectorY = game.camera.offsetY + game.context.canvas.height / 2 - game.mouse.y;

    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    if (length > 0) {
      vectorX /= length;
      vectorY /= length;

      this.angle = Math.atan2(vectorY, vectorX) + 90 * Math.PI / 180;
    }

    // foot
    if (game.keyboard.up || game.keyboard.down || game.keyboard.left || game.keyboard.right) {
      this.incrementer += this.speed;
    }

    this.position = Math.sin(this.incrementer * Math.PI / 180);
  };

  render (context) {
    if (this.sleep) {
      return;
    }

    EntityHelper.render(context, this);
  };
};
