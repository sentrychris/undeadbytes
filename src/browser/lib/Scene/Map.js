import { levels } from '../Levels/mappings';

/**
 * The Map class manages the configuration and generation of game maps.
 * Maps are represented as arrays of strings, where each character denotes
 * a different game entity such as walls, enemies, pickups, and the player.
 * @class
 * @category Game Scene
 */
export class Map
{
  /**
   * Create a new map.
   * 
   * @constructor
   */
  constructor () {
    this.levels = levels;
    this.newMapConfiguration();
  }

  /**
   * Reset all map entity positions.
   * 
   * Resets all entity positions to their default values, placing the player 
   * at the top-left corner and clearing arrays for enemies, walls, ammo pickups, 
   * health pickups, and stamina pickups.
   * 
   * @returns {void}
   */
  newMapConfiguration () {
    /**
     * playerPosition - the player's spawn position
     * @type {Object}
     */
    this.playerPosition = {
      x: 0,
      y: 0
    };

    /**
     * enemyPositions - the enemy spawn positions
     * @type {array}
     */
    this.enemyPositions = [];

    /**
     * enemyPositions - the wall placement positions
     * @type {array}
     */
    this.wallPositions = [];

    /**
     * ammoPickupPositions - the ammo pickup item positions
     * @type {array}
     */
    this.ammoPickupPositions = [];

    /**
     * healthPickupPositions - the healt pickup item positions
     * @type {array}
     */
    this.healthPickupPositions = [];

    /**
     * staminaPickupPositions - the stamina pickup item positions
     * @type {array}
     */
    this.staminaPickupPositions = [];
  }

  /**
   * Generate a new map.
   * 
   * Generates a new map based on the specified levelIndex. Processes the
   * corresponding level configuration and updates position arrays for entities.
   * 
   * @param {number} levelIndex - the index of the level configuration
   * 
   * @returns {void}
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
   * Get the player entity's map position.
   * 
   * @returns {Object}
   */
  getPlayerPosition () {
    return this.playerPosition;
  }

  /**
   * Get the enemy entities' map positions.
   * 
   * @returns {array}
   */
  getEnemyPositions () {
    return this.enemyPositions;
  }

  /**
   * Get the wall pickup entities' map positions.
   * 
   * @returns {array}
   */
  getWallPositions () {
    return this.wallPositions;
  }

  /**
   * Get the ammo pickup entities' map positions.
   * 
   * @returns {array}
   */
  getAmmoPickupPositions () {
    return this.ammoPickupPositions;
  }

  /**
   * Get the health pickup entities' map positions.
   * 
   * @returns {array}
   */
  getHealthPickupPositions () {
    return this.healthPickupPositions;
  }

  /**
   * Get the stamina pickup entities' map positions.
   * 
   * @returns {array}
   */
  getStaminaPickupPositions () {
    return this.staminaPickupPositions;
  }
}