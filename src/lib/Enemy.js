import { Calculator } from './Entity/Calculator';
import { AudioFX } from './AudioFX';
import { config } from '../config';

export class Enemy
{
  constructor (spawn) {
    this.type = 'enemy';
    this.bounding = 'arc';
    this.x = spawn.x * config.size;
    this.y = spawn.y * config.size;
    this.angle = 0;
    this.position = 0;
    this.incrementer = 0;
    this.speed = 3;
    
    this.sleep = true;
    
    this.pushAlongVelocity = {
      x: 0,
      y: 0
    };
    this.pushBulletVelocity = {
      x: 0,
      y: 0
    };
    this.canBePushedByBullet = true;
    this.lastVectorX = 0;
    this.lastVectorY = 0;

    this.health = 100;
    this.dead = false;
    this.allEnemiesDead = false;
  }

  pushAlong (vectorX, vectorY) {
    this.pushAlongVelocity.x = vectorX * 10;
    this.pushAlongVelocity.y = vectorY * 10;
  }

  pushByBullet (bullet, dps, enemies) {
    if (this.canBePushedByBullet) {
      this.pushBulletVelocity.x = bullet.vectorX * 15;
      this.pushBulletVelocity.y = bullet.vectorY * 15;
      this.canBePushedByBullet = false;
  
      this.health -= dps;
      this.health = this.health < 0 ? 0 : this.health;
  
      if (this.health == 0) {
        this.dead = true;

        document.querySelector('body').style.background = 'radial-gradient(white 5%, green 30%, black 100%)';
        setTimeout(() => {
          document.querySelector('body').style.background = 'black';
        }, 50);

        // Last remaining enemy has been killed
        // update is not called on the next tick
        if (enemies.length === 1) {
          enemies.length = 0;
          this.allEnemiesDead = true;
        }
      }
    }
  }

  update (game) {
    if (this.sleep || this.dead) {
      return;
    }
    
    Calculator.playerToEntity(this, game);

    if (Math.random() <= 0.1) {
      for (let i = 0; i < game.enemies.length; i++) {       
        const enemy = game.enemies[i];
  
        if (enemy != this) {
          let vectorX = enemy.x - this.x;
          let vectorY = enemy.y - this.y;

          const distance = Calculator.distance(vectorX, vectorY);
          
          if (distance != 0 && distance < 100) {
            vectorX /= distance;
            vectorY /= distance;
            enemy.pushAlong(vectorX, vectorY);
          } 
        }
        
        if (enemy.dead) {
          // AudioFX.snippet({ random: true });
          game.enemies.splice(i, 1);
        }
      }
    }

    // push along velocity
    this.pushAlongVelocity.x *= 0.9;
    this.pushAlongVelocity.y *= 0.9;
    
    this.x += this.pushAlongVelocity.x;
    this.y += this.pushAlongVelocity.y;

    // bullet collision
    const bounds = {
      x: this.x - config.radius,
      y: this.y - config.radius,
      width: config.radius * 2,
      height: config.radius * 2
    };

    for (let i = 0; i < game.ballistics.bullets.length; i++) {
      const bullet = game.ballistics.bullets[i];

      if (Calculator.intersection(bounds, bullet.bounds)) {
        bullet.markToDelete = true;
        this.pushByBullet(bullet, game.ballistics.weapon.projectile.dps, game.enemies);
      }
    }

    // push bullet velocity
    this.pushBulletVelocity.x *= 0.9;
    this.pushBulletVelocity.y *= 0.9;
    
    this.x += this.pushBulletVelocity.x;
    this.y += this.pushBulletVelocity.y;

    if (Math.abs(this.pushBulletVelocity.x) < 0.5 && Math.abs(this.pushBulletVelocity.y) < 0.5) {
      this.canBePushedByBullet = true;
      this.pushBulletVelocity.x = 0;
      this.pushBulletVelocity.y = 0;
    }
  }

  render (context) {
    if (this.sleep) {
      return;
    }

    Calculator.render(context, this);
  }
}
