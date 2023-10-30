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
  static arcBoxCollision ({ arcX, arcY, rectX, rectY, size, radius }) {
    const distX = Math.abs(arcX - rectX - size / 2);
    const distY = Math.abs(arcY - rectY - size / 2);
  
    // No overlap
    if (distX > (size / 2 + radius) || distY > (size / 2 + radius)) {
      return false;
    }

    // collision along x or y axis
    if (distX <= (size / 2) || distY <= (size / 2)) {
      return true;
    }
  
    // circular collision
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
  
      if (Collision.arcBoxCollision({
        arcX: entity.x,
        arcY: entity.y,
        rectX: wall.x,
        rectY: wall.y,
        size: config.cell.size,
        radius: config.cell.radius,
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
    let vectorX = game.player.x - entity.x;
    let vectorY = game.player.y - entity.y;

    if (game.player.dead) {
      vectorX = entity.lastVectorX;
      vectorY = entity.lastVectorY;
    } else {
      entity.lastVectorX = vectorX;
      entity.lastVectorY = vectorY;
    }

    const distance = Collision.distance(vectorX, vectorY);

    if (entity.type === 'pickup') {
      if (callback && distance <= entity.distance) {
        callback();
      }
    }

    if (distance > 0 && entity.type === 'enemy') {
      vectorX /= distance;
      vectorY /= distance;

      if (distance < 800) {
        entity.angle = Math.atan2(vectorY, vectorX) - 90 * Math.PI / 180;
        entity.x += vectorX * entity.speed;
        entity.y += vectorY * entity.speed;

        const collisionVector = Collision.entityToWalls(entity, game.walls);
        entity.x += collisionVector.x * entity.speed;
        entity.y += collisionVector.y * entity.speed;

        entity.incrementer += entity.speed;
        entity.position = Math.sin(entity.incrementer * Math.PI / 180);

        if (distance < 100 && entity.type === 'enemy') {
          game.player.takeDamage(entity);
        }
      }
    }
  }
}