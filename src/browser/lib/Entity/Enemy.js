import { Collision } from '../Collision';
import { Renderer } from '../Renderer';
import { AudioFX } from '../Audio/AudioFX';
import { config } from '../../config';

/**
 * Enemy entity
 * @typedef {import('../Game').Game} Game
 */
export class Enemy
{
  /**
   * Create a new enemy entity.
   * @param {Object} spawn - the enemy spawn coordinates
   * @param {number} spawn.x - the enemy spawn x-coordinate
   * @param {number} spawn.y - the enemy spawn y-coordinate
   */
  constructor (spawn) {
    this.type = 'enemy';
    this.bounding = 'arc';
    this.x = spawn.x * config.cell.size;
    this.y = spawn.y * config.cell.size;
    this.angle = 0;
    this.position = 0;
    this.incrementer = 0;
    this.speed = 3;
    
    this.sleep = true;
    
    this.pushAlongVelocity = {
      x: 0,
      y: 0
    };
    this.projectileHitVelocity = {
      x: 0,
      y: 0
    };
    this.canBeHitByProjectile = true;
    this.lastVectorX = 0;
    this.lastVectorY = 0;

    this.health = 100;
    this.dead = false;
    this.allEnemiesDead = false;
  }

  /**
   * Render the enemy entity on the canvas.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the enemy entity for rendering, collision and behaviour.
   * @param {Game} game - the managed game instance
   * @returns 
   */
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
          // AudioFX.snippet({ random: true });
          game.enemies.splice(i, 1);
        }
      }
    }

    this.pushAlongVelocity.x *= 0.9;
    this.pushAlongVelocity.y *= 0.9;
    
    this.x += this.pushAlongVelocity.x;
    this.y += this.pushAlongVelocity.y;

    const bounds = {
      x: this.x - config.cell.radius,
      y: this.y - config.cell.radius,
      width: config.cell.radius * 2,
      height: config.cell.radius * 2
    };

    for (let i = 0; i < game.ballistics.projectiles.length; i++) {
      const projectile = game.ballistics.projectiles[i];

      if (Collision.intersection(bounds, projectile.bounds)) {
        projectile.markToDelete = true;
        this.hitByProjectile(projectile, game.ballistics.weapon.projectile.dps, game.enemies);
      }
    }

    this.projectileHitVelocity.x *= 0.9;
    this.projectileHitVelocity.y *= 0.9;
    
    this.x += this.projectileHitVelocity.x;
    this.y += this.projectileHitVelocity.y;

    if (Math.abs(this.projectileHitVelocity.x) < 0.5 && Math.abs(this.projectileHitVelocity.y) < 0.5) {
      this.canBeHitByProjectile = true;
      this.projectileHitVelocity.x = 0;
      this.projectileHitVelocity.y = 0;
    }
  }

  /**
   * Set the push velocity to push enemies when bumped by entities.
   * @param {number} vectorX 
   * @param {number} vectorY 
   */
  pushAlong (vectorX, vectorY) {
    this.pushAlongVelocity.x = vectorX * 10;
    this.pushAlongVelocity.y = vectorY * 10;
  }

  /**
   * Set the enemy velocity and handle DPS when enemies are hit by projectiles.
   * @param {*} projectile 
   * @param {number} dps 
   * @param {array} enemies 
   */
  hitByProjectile (projectile, dps, enemies) {
    if (this.canBeHitByProjectile) {
      this.projectileHitVelocity.x = projectile.vectorX * 15;
      this.projectileHitVelocity.y = projectile.vectorY * 15;
      this.canBeHitByProjectile = false;
  
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
