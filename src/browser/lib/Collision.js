import { config } from '../config';

/**
 * Entity Collision
 * @class
 * @category Game
 */
export class Collision
{
  /**
   * Determine whether or not two entities intersect on the canvas.
   * 
   * This method is a basic collision check that determines if two entities,
   * defined by their rectangular properties (x, y, width, height), intersect.
   * The logic is straightforward: if any side of one entity is positioned to the
   * left, right, above, or below the other, they do not intersect. Otherwise,
   * they overlap, triggering a collision.
   * 
   * @param {Object} r1 - first entity
   * @param {number} r1.x - first entity x coordinate
   * @param {number} r1.y - first entity y coordinate
   * @param {number} r1.width - first entity width
   * @param {number} r1.height - first entity height
   * @param {Object} r2 - second entity
   * @param {number} r2.x - second entity x coordinate
   * @param {number} r2.y - second entity y coordinate
   * @param {number} r2.width - second entity width
   * @param {number} r2.height - second entity height
   * 
   * @returns {boolean}
   */
  static intersection (r1, r2) {
    return ! (r1.x + r1.width < r2.x
      || r1.y + r1.height < r2.y
      || r1.x > r2.x + r2.width
      || r1.y > r2.y + r2.height
    );
  }

  /**
   * Determine distance between two vectors or two entities with vectors.
   * 
   * This method calculates the Euclidean distance between two points.
   * It's versatile, accepting either entity objects or numerical values
   * as parameters. When `vectors` is set to `true`, the method considers
   * the parameters as vector components, determining the distance between
   * the points they represent.
   * 
   * @param {Object|number} e1 - the first entity or vector coordinates
   * @param {Object|number} e2 - the second entity or vector coordinates
   * @param {boolean} useVectors - whether or not we're passing entities or vectors
   * 
   * @returns {number}
   */
  static distance (e1, e2, useVectors = true) {
    if (useVectors) {
      return Math.sqrt(e1*e1 + e2*e2);
    }

    const vectorX = e1.x - e2.x;
    const vectorY = e1.y - e2.y;

    return Math.sqrt(vectorX*vectorX + vectorY*vectorY);
  }

  /**
   * Caclulate collision beween entity (arc) and wall (box).
   * 
   * This method is a specialized function designed for detecting collisions between
   * an arc-shaped entity (potentially representing the player) and a rectangular
   * box-shaped entity (potentially representing a wall) on the canvas.
   * 
   * @param {Object} params 
   * @param {number} params.arcX - the arc entity's x-coordinate
   * @param {number} params.arcY - the arc entity's y-coordinate
   * @param {number} params.rectX - the box entity's x-coordinate
   * @param {number} params.rectY - the box entity's y-coordinate
   * @param {number} params.size - the size of the box entity
   * @param {number} params.radius - the radius of the arc entity
   * 
   * @returns {boolean}
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
   * Detect and handle collision between entities and walls.
   * 
   * @see https://github.com/sentrychris/docs/full/collision/entity-to-walls.md
   * 
   * @param {Object} entity - a game entity
   * @param {array} walls - the walls
   * 
   * @returns {Object}
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
   * Player-to-entity collision.
   * 
   * @see https://github.com/sentrychris/docs/full/collision/entity-to-player.md
   * 
   * @param {Object} entity - the entity
   * @param {Game} game - the managed game instance
   * @param {Object} callbackOptions
   * @param {string|null} callbackOptions.on - maps to the entity type to know which entity to execute on
   * @param {string|null} callbackOptions.onDistance - the distance between the player and the entity before the callback executes
   * @param {function|null} callbackOptions.callback - the callback to execute when the player and entity intersect
   * 
   * @returns {void}
   */
  static entityToPlayer (entity, game, { on = null, onDistance = null, callback = null }) {
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

    if (callback && on === entity.type && distance <= onDistance) {
      callback();
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

        if (distance < 100) {
          game.player.takeDamage(entity);
        }
      }
    }
  }
}