
import { EntityCollision } from './Physics/EntityCollision';
import { EntityDrawer } from './Physics/EntityDrawer';
import { EntityHelper } from './Physics/EntityHelper';

export class Player
{
  constructor (spawn, gameover) {
    this.bounding = 'arc';
    this.x = spawn.x * 150;
    this.y = spawn.y * 150;
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
    this.gameover = gameover;
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

          setTimeout(() => {
            this.gameover.style.display = 'block';
          }, 1000);
        }
      }
    }
  }

  update (context, player, enemies, walls, bulletManager, camera, keyboard, mouse) {
    if (this.sleep || this.dead) {
      return;
    }

    let count = 0;
    count += keyboard.up ? 1 : 0;
    count += keyboard.down ? 1 : 0;
    count += keyboard.left ? 1 : 0;
    count += keyboard.right ? 1 : 0;

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
      if (keyboard.up) this.y -= currentSpeed;
      if (keyboard.down) this.y += currentSpeed;
      if (keyboard.left) this.x -= currentSpeed;
      if (keyboard.right) this.x += currentSpeed;
    }

    // collision
    const collisionVector = EntityCollision.arcToWalls(this.x, this.y, walls);
    this.x += collisionVector.x * currentSpeed;
    this.y += collisionVector.y * currentSpeed;

    // mouse
    let vectorX = camera.offsetX + context.canvas.width / 2 - mouse.x;
    let vectorY = camera.offsetY + context.canvas.height / 2 - mouse.y;

    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    if (length > 0) {
      vectorX /= length;
      vectorY /= length;

      this.angle = Math.atan2(vectorY, vectorX) + 90 * Math.PI / 180;
    }

    // foot
    if (keyboard.up || keyboard.down || keyboard.left || keyboard.right) {
      this.incrementer += this.speed;
    }

    this.position = Math.sin(this.incrementer * Math.PI / 180);
  };

  render (context) {
    if (this.sleep) {
      return;
    }

    EntityHelper.render(context, 'player', this);
  };
};
