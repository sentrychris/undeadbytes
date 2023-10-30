import { levels } from '../Levels/mappings';

/**
 * Map handler
 */
export class Map
{
  /**
   * Create a new map.
   */
  constructor () {
    this.levels = levels;
    this.newMapConfiguration();
  }

  /**
   * Generate a new map.
   * @param {number} levelIndex - the index of the level configuration
   */
  generate (levelIndex = 1) {
    const level = levels[levelIndex];
    for (let y = 0; y < level.length; y++) {
      const row = level[y];

      for (let x = 0; x < row.length; x += 2) {
        const char = row[x];
        const realX = x / 2;

        switch (char) {
        case 'W': this.wallPositions.push({ x: realX, y }); break;
        case 'E': this.enemyPositions.push({ x: realX, y }); break;
        case 'A': this.ammoPickupPositions.push({ x: realX, y }); break;
        case 'H': this.healthPickupPositions.push({ x: realX, y }); break;
        case 'S': this.staminaPickupPositions.push({x: realX, y }); break;
        case 'P': this.playerPosition = { x: realX, y: y }; break;
        }
      }
    }
  }

  /**
   * Reset all map entity positions.
   */
  newMapConfiguration () {
    this.playerPosition = {
      x: 0,
      y: 0
    };
    this.enemyPositions = [];
    this.wallPositions = [];
    this.ammoPickupPositions = [];
    this.healthPickupPositions = [];
    this.staminaPickupPositions = [];
  }

  /**
   * Get the player entity's map position.
   * @returns {*}
   */
  getPlayerPosition () {
    return this.playerPosition;
  }

  /**
   * Get the enemy entities' map positions.
   * @returns {array}
   */
  getEnemyPositions () {
    return this.enemyPositions;
  }

  /**
   * Get the wall pickup entities' map positions.
   * @returns {array}
   */
  getWallPositions () {
    return this.wallPositions;
  }

  /**
   * Get the ammo pickup entities' map positions.
   * @returns {array}
   */
  getAmmoPickupPositions () {
    return this.ammoPickupPositions;
  }

  /**
   * Get the health pickup entities' map positions.
   * @returns {array}
   */
  getHealthPickupPositions () {
    return this.healthPickupPositions;
  }

  /**
   * Get the stamina pickup entities' map positions.
   * @returns {array}
   */
  getStaminaPickupPositions () {
    return this.staminaPickupPositions;
  }
}