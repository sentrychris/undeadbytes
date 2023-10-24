import { EntityCollision } from './EntityCollision';
import { EntityDrawer } from './EntityDrawer';

export class EntityHelper
{
  /**
   * Determine intersection between entities
   * 
   * @param {*} r1 
   * @param {*} r2 
   * @returns 
   */
  static intersection (r1, r2) {
    return ! (r1.x + r1.width < r2.x
      || r1.y + r1.height < r2.y
      || r1.x > r2.x + r2.width
      || r1.y > r2.y + r2.height
    );
  }

  /**
   * Begin rotating entity to given angle at position
   * 
   * @param {*} context 
   * @param {*} x 
   * @param {*} y 
   * @param {*} angle 
   */
  static beginRotationOffset (context, x, y, angle) {
    context.translate(-(-x + context.canvas.width / 2), -(-y + context.canvas.height / 2));
    context.translate(context.canvas.width / 2, context.canvas.height / 2);

    context.rotate(angle);
  }

  /**
   * Stop rotating entity to given angle at position
   * 
   * @param {*} context 
   * @param {*} x 
   * @param {*} y 
   * @param {*} angle 
   */
  static endRotationOffset (context, x, y, angle) {
    context.rotate(-angle);

    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    context.translate(+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));
  }

  /**
   * Render the entity
   * 
   * @param {*} context 
   * @param {*} entity 
   */
  static render (context, entity) {
    EntityHelper.beginRotationOffset(context, entity.x, entity.y, entity.angle);

    if (! entity.dead) {
      entity.type === 'enemy'
        ? EntityDrawer.enemy(context, entity.position)
        : EntityDrawer.player(context, entity.position);
    } else {
      entity.type === 'enemy'
        ? EntityDrawer.deadEnemy(context)
        : EntityDrawer.deadPlayer(context);
    }
    
    EntityHelper.endRotationOffset(context, entity.x, entity.y, entity.angle);
    EntityDrawer.health(context, entity.health, entity.x, entity.y);
  }

  static playerToEntity (entity, game, callback) {
    // Determine the next x,y position vectors based on the distance
    // between the player and the enemy's current x,y position.
    let vectorX = game.player.x - entity.x;
    let vectorY = game.player.y - entity.y;

    if (game.player.dead) {
      // If the player is dead, set the enemy's x,y position to their
      // last known position.
      vectorX = entity.lastVectorX;
      vectorY = entity.lastVectorY;
    } else {
      // Otherwise update their last known position with the newly
      // determined x,y position.
      entity.lastVectorX = vectorX;
      entity.lastVectorY = vectorY;
    }

    // Determine the distance between the enemy and the player
    let distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    if (entity.type === 'pickup') {
      if (callback && distance <= 95) {
        callback();
      }
    }

    if (distance > 0 && entity.type === 'enemy') {
      vectorX /= distance;
      vectorY /= distance;

      // If the vector length is lower than 800, than set the enemy's
      // angle and position toward the player.
      if (distance < 800) {
        entity.angle = Math.atan2(vectorY, vectorX) - 90 * Math.PI / 180;
        entity.x += vectorX * entity.speed;
        entity.y += vectorY * entity.speed;

        // Determine the wall position vectors for collision to stop enemies phasing
        // through walls to try and get to you.
        const collisionVector = EntityCollision.vector(entity.x, entity.y, game.walls);
        // If there is a wall in the way, repeatedly set the enemy's x,y position to the wall
        // position while maintaining speed.
        entity.x += collisionVector.x * entity.speed;
        entity.y += collisionVector.y * entity.speed;

        // Use the enemy's momentum to adjust the angle until they work their way around
        // the wall.
        entity.incrementer += entity.speed;
        entity.position = Math.sin(entity.incrementer * Math.PI / 180);

        if (distance < 100 && entity.type === 'enemy') {
          // If the vecotr length is lower than 100
          // hurt the player
          game.player.takeDamage(entity);
        }
      }
    }
  }
}
