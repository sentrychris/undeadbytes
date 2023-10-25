import { Collision } from '../Collision';
import { Renderer } from '../Renderer';
import { AudioFX } from '../AudioFX';
import { config } from '../../config';

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
    this.pushProjectileVelocity = {
      x: 0,
      y: 0
    };
    this.canBePushedByProjectile = true;
    this.lastVectorX = 0;
    this.lastVectorY = 0;

    this.health = 100;
    this.dead = false;
    this.allEnemiesDead = false;
  }

  render (context) {
    Renderer.render(this, context);
  }

  update (game) {
    if (this.sleep || this.dead) {
      return;
    }
    
    Collision.entityToPlayer(this, game);

    if (Math.random() <= 0.1) {
      for (let i = 0; i < game.enemies.length; i++) {       
        const enemy = game.enemies[i];
  
        if (enemy != this) {
          let vectorX = enemy.x - this.x;
          let vectorY = enemy.y - this.y;

          const distance = Collision.distance(vectorX, vectorY);
          
          if (distance != 0 && distance < 100) {
            vectorX /= distance;
            vectorY /= distance;
            enemy.pushAlong(vectorX, vectorY);
          } 
        }
        
        if (enemy.dead) {
          AudioFX.snippet({ random: true });
          game.enemies.splice(i, 1);
        }
      }
    }

    this.pushAlongVelocity.x *= 0.9;
    this.pushAlongVelocity.y *= 0.9;
    
    this.x += this.pushAlongVelocity.x;
    this.y += this.pushAlongVelocity.y;

    const bounds = {
      x: this.x - config.radius,
      y: this.y - config.radius,
      width: config.radius * 2,
      height: config.radius * 2
    };

    for (let i = 0; i < game.ballistics.projectiles.length; i++) {
      const projectile = game.ballistics.projectiles[i];

      if (Collision.intersection(bounds, projectile.bounds)) {
        projectile.markToDelete = true;
        this.pushByProjectile(projectile, game.ballistics.weapon.projectile.dps, game.enemies);
      }
    }

    this.pushProjectileVelocity.x *= 0.9;
    this.pushProjectileVelocity.y *= 0.9;
    
    this.x += this.pushProjectileVelocity.x;
    this.y += this.pushProjectileVelocity.y;

    if (Math.abs(this.pushProjectileVelocity.x) < 0.5 && Math.abs(this.pushProjectileVelocity.y) < 0.5) {
      this.canBePushedByProjectile = true;
      this.pushProjectileVelocity.x = 0;
      this.pushProjectileVelocity.y = 0;
    }
  }

  pushAlong (vectorX, vectorY) {
    this.pushAlongVelocity.x = vectorX * 10;
    this.pushAlongVelocity.y = vectorY * 10;
  }

  pushByProjectile (projectile, dps, enemies) {
    if (this.canBePushedByProjectile) {
      this.pushProjectileVelocity.x = projectile.vectorX * 15;
      this.pushProjectileVelocity.y = projectile.vectorY * 15;
      this.canBePushedByProjectile = false;
  
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
}
