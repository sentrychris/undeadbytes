import { config } from '../config';

export class Collision
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
   * Determine distance between two vectors
   * 
   * @param {*} e1 
   * @param {*} e2 
   * @param {*} vectors 
   * @returns 
   */
  static distance (e1, e2, vectors = true) {
    if (vectors) {
      return Math.sqrt(e1*e1 + e2*e2);
    }

    const vectorX = e1.x - e2.x;
    const vectorY = e1.y - e2.y;

    return Math.sqrt(vectorX*vectorX + vectorY*vectorY);
  }

  /**
   * Caclulate collision beween entity (arc) and wall (box)
   * 
   * @param {*} param0 
   * @returns 
   */
  static arcWallVector ({ arcX, arcY, radius, wallX, wallY, size }) {
    const distX = Math.abs(arcX - wallX - size / 2);
    const distY = Math.abs(arcY - wallY - size / 2);
  
    if (distX > (size / 2 + radius)) {
      return false;
    }

    if (distY > (size / 2 + radius)) {
      return false;
    }
  
    if (distX <= (size / 2)) {
      return true;
    }

    if (distY <= (size / 2)) {
      return true;
    }
  
    const dX = distX - size / 2;
    const dY = distY - size / 2;
  
    return (dX * dX + dY * dY <= (radius * radius));
  }

  /**
   * Entity-to-walls collision
   * 
   * @param {*} entity
   * @param {*} walls 
   * @returns 
   */
  static entityToWalls (entity, walls) {
    const result = {
      x: 0,
      y: 0
    };

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
  
      if (Collision.arcWallVector({
        arcX: entity.x,
        arcY: entity.y,
        radius: 60,
        wallX: wall.x,
        wallY: wall.y,
        size: config.cell.size
      })) {
        const wallCenterX = wall.x + config.cell.size / 2;
        const wallCenterY = wall.y + config.cell.size / 2;
  
        let vectorX = entity.x - wallCenterX;
        let vectorY = entity.y - wallCenterY;
  
        const distance = Collision.distance(vectorX, vectorY);
  
        if (distance > 0) {
          vectorX /= distance;
          vectorY /= distance;
  
          result.x += vectorX;
          result.y += vectorY;
        }
      }
    }
  
    return result;
  }

  /**
   * Player-to-entity collision
   * 
   * @param {*} entity 
   * @param {*} game 
   * @param {*} callback 
   */
  static entityToPlayer (entity, game, callback) {
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
    const distance = Collision.distance(vectorX, vectorY);

    if (entity.type === 'pickup') {
      if (callback && distance <= entity.distance) {
        callback();
      }
    }

    if (distance > 0 && entity.type === 'enemy') {
      vectorX /= distance;
      vectorY /= distance;

      // If the distance is lower than 800, than set the enemy's
      // angle and position toward the player.
      if (distance < 800) {
        entity.angle = Math.atan2(vectorY, vectorX) - 90 * Math.PI / 180;
        entity.x += vectorX * entity.speed;
        entity.y += vectorY * entity.speed;

        // Determine the wall position vectors for collision to stop enemies phasing
        // through walls to try and get to you.
        const collisionVector = Collision.entityToWalls(entity, game.walls);
        // If there is a wall in the way, repeatedly set the enemy's x,y position to the wall
        // position while maintaining speed.
        entity.x += collisionVector.x * entity.speed;
        entity.y += collisionVector.y * entity.speed;

        // Use the enemy's momentum to adjust the angle until they work their way around the wall
        entity.incrementer += entity.speed;
        entity.position = Math.sin(entity.incrementer * Math.PI / 180);

        if (distance < 100 && entity.type === 'enemy') {
          // If the distance is lower than 100 then hurt the player
          game.player.takeDamage(entity);
        }
      }
    }
  }
}