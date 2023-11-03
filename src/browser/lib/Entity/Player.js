
import { Collision } from '../Collision';
import { Renderer } from '../Renderer';
import { AudioFX } from '../Audio/AudioFX';
import { config } from '../../config';

/**
 * Player entity
 */
export class Player
{
  /**
   * Create a new player entity.
   * @param {Object} spawn - the player spawn coordinates
   * @param {number} spawn.x - the player spawn x-coordinate
   * @param {number} spawn.y - the player spawn y-coordinate
   */
  constructor (spawn) {
    this.type = 'player';
    this.bounding = 'arc';
    this.x = spawn.x * config.cell.size;
    this.y = spawn.y * config.cell.size;
    this.angle = 0;
    this.position = 0;
    
    this.incrementer = 0;
    this.speed = 5;
    this.stamina = false;
    this.staminaAmount = 0;

    this.sleep = true;
    
    this.invincible = false;
    this.health = 100;

    this.pickups = {
      health: 0,
      stamina: 0
    };
    
    this.damage = {
      x: 0,
      y: 0
    };
    this.dead = false;
  }

  /**
   * Render the player entity on the canvas.
   * @param {CanvasRenderingContext2D} context - the canvas rendering context
   * @returns {void}
   */
  render (context) {
    Renderer.render(this, context);
  }

  /**
   * Update the player entity for rendering, collision and behaviour.
   * @param {Game} game - the managed game instance
   * @returns {void}
   */
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

    // Detect collision between the player and the walls and "bounce" back
    // using the vector difference multipled by the current player's speed.
    const collisionVector = Collision.entityToWalls(this, game.walls);
    this.x += collisionVector.x * currentSpeed;
    this.y += collisionVector.y * currentSpeed;

    // mouse
    let vectorX = game.camera.offsetX + game.context.canvas.width / 2 - game.mouse.x;
    let vectorY = game.camera.offsetY + game.context.canvas.height / 2 - game.mouse.y;

    const distance = Collision.distance(vectorX, vectorY);

    if (distance > 0) {
      vectorX /= distance;
      vectorY /= distance;

      this.angle = Math.atan2(vectorY, vectorX) + 90 * Math.PI / 180;
    }

    // foot
    if (game.keyboard.up || game.keyboard.down || game.keyboard.left || game.keyboard.right) {
      this.incrementer += this.speed;
    }

    this.position = Math.sin(this.incrementer * Math.PI / 180);
  }

  /**
   * Handle damage from colliding enemies.
   * @param {Enemy} enemy the enemy entity
   * @returns {void}
   */
  takeDamage (enemy) {
    if (! this.invincible) {
      const vectorX = this.x - enemy.x;
      const vectorY = this.y - enemy.y;

      const distance = Collision.distance(vectorX, vectorY);

      if (distance > 0) {
        this.damage.x = vectorX / distance * 20;
        this.damage.y = vectorY / distance * 20;
        this.invincible = true;
        
        this.health -= 25;
        this.health = this.health < 0 ? 0 : this.health;

        if (this.health == 0) {
          AudioFX.snippet({ name: 'eoww' });
          this.dead = true;
        }
      }
    }
  }

  /**
   * Boost player speed when stamina entity is picked up
   * @param {number} amount - the amount of speed to boost by
   * @returns {void}
   */
  boostSpeed (amount) {
    this.speed = amount;
    setTimeout(() => {
      this.speed = 5;
    }, 3000);
  }

  /**
   * Refill player health when health entity is picked up or used
   * @param {number} amount - the amount of health to restore
   * @param {boolean} pickup - if false, then player is using a stored item
   * @returns {void}
   */
  refillHealth (amount, pickup = false) {
    const refill = (health) => {
      const increase = this.health + health;
      if (increase <= 100) {
        this.health = increase;
      }
    };

    if (this.health < 100) {
      if (! pickup) {
        if (this.pickups.health <= 0) {
          this.pickups.health = 0;
        } else {
          refill(amount);
          --this.pickups.health;
        }
      } else {
        refill(amount);
      }
    } else if (pickup) {
      ++this.pickups.health;
    }

    document.querySelector('#medkits-available').innerHTML = this.pickups.health;
  }
}
