import { Collision } from '../Collision';
import { Renderer } from '../Render/Renderer';
import { AudioFX } from '../Audio/AudioFX';
import { config } from '../../config';

/**
 * Enemy entity
 * @class
 * @category Game Entities
 */
export class Enemy
{
  /**
   * Create a new enemy entity.
   * 
   * @constructor
   * @param {Object} spawn - the enemy spawn coordinates
   * @param {number} spawn.x - the enemy spawn x-coordinate
   * @param {number} spawn.y - the enemy spawn y-coordinate
   * @param {Object} color - the enemy's color
   * @param {string} color.hands - the enemy hands color
   * @param {string} color.feet - the enemy feet color
   * @param {string} color.torso - the enemy torso color
   */
  constructor (spawn, color = {
    hands: null, feet: null, torso: null
  }) {
    /**
     * type - the type of entity.
     * @type {string}
     */
    this.type = 'enemy';

    /**
     * bounding - the entity's bounding behavior.
     * @type {string}
     */
    this.bounding = 'arc';

    /**
     * Color - entity feet, hands and torso color.
     * @type {Object}
     */
    this.color = color;

    /**
     * x - the entity's x coordinate.
     * @type {number}
     */
    this.x = spawn.x * config.cell.size;

    /**
     * y - the entity's y coordinate.
     * @type {number}
     */
    this.y = spawn.y * config.cell.size;

    /**
     * angle - the entity's angle.
     * @type {number}
     */
    this.angle = 0;

    /**
     * position - the entity's position.
     * @type {number}
     */
    this.position = 0;

    /**
     * incrementer - the entity's speed incrementer.
     * @type {number}
     */
    this.incrementer = 0;

    /**
     * speed - the entity's speed.
     * @type {number}
     */
    this.speed = 3;
    
    /**
     * sleep - the entity's render state.
     * @type {boolean}
     */
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
   * 
   * This is called every frame/repaint to render the entity. Note that this is
   * an animated entity, therefore the x,y coordinates will change on
   * update.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * 
   * @returns {void}
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the enemy entity for rendering, collision and behaviour.
   * 
   * Checks the render state, checks enemy-enemy collision and sets speed/direction
   * accordingly, checks to see if the enemy is dead and updates the tracked entities,
   * updates the enemy entity's bounds, checks for ballistic projectile collisions and
   * sets damage and projectile "pushback" velocity. This is called every frame/repaint.
   * 
   * @param {Game} game - the managed game instance
   * 
   * @returns {void}
   */
  update (game) {
    if (this.sleep || this.dead) {
      return;
    }
    
    Collision.entityToPlayer(this, game, {
      on: this.type,
      onDistance: 350,
      onCallback: () => {
        if (! this.dead && ! this.allEnemiesDead) {
          AudioFX.snippet({ name: 'zombiegrowl' });
        }
      }
    });

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
   * 
   * @param {number} vectorX - the enemy's vector x-coordinate
   * @param {number} vectorY - the enemy's vector y-coordinate
   * 
   * @returns {void}
   */
  pushAlong (vectorX, vectorY) {
    this.pushAlongVelocity.x = vectorX * 10;
    this.pushAlongVelocity.y = vectorY * 10;
  }

  /**
   * Set the enemy velocity and handle DPS when enemies are hit by projectiles.
   * 
   * @param {Object} projectile - the weapon projectile data object
   * @param {number} dps  - the damage per shot
   * @param {array} enemies - the tracked enemy entities
   * 
   * @returns {void} 
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
