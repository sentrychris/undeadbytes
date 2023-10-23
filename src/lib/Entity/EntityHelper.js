import { EntityCollision } from './EntityCollision';
import { EntityDrawer } from './EntityDrawer';

export class _EntityHelper
{
  /**
   * Determine intersection between entities
   * 
   * @param {*} r1 
   * @param {*} r2 
   * @returns 
   */
  intersection (r1, r2) {
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
  beginRotationOffset (context, x, y, angle) {
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
  endRotationOffset (context, x, y, angle) {
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
  render (context, entity) {
    this.beginRotationOffset(context, entity.x, entity.y, entity.angle);

    if (! entity.dead) {
      entity.type === 'enemy'
        ? EntityDrawer.enemy(context, entity.position)
        : EntityDrawer.player(context, entity.position);
    } else {
      entity.type === 'enemy'
        ? EntityDrawer.deadEnemy(context)
        : EntityDrawer.deadPlayer(context);
    }
    
    this.endRotationOffset(context, entity.x, entity.y, entity.angle);
    EntityDrawer.health(context, entity.health, entity.x, entity.y);
  }

  playerToEntity (vectorX, vectorY, entity, game) {
    // Determine the distance between the enemy and the player
    let distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    if (distance > 0) {
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

export const EntityHelper = new _EntityHelper();
