import { mappings } from '../Levels/mappings';

export class Map
{
  constructor () {
    this.levels = mappings;
    this.newMapConfiguration();
  }

  generate (levelIndex = 1) {
    const level = mappings[levelIndex];
    for (let y = 0; y < level.length; y++) {
      const row = level[y];

      for (let x = 0; x < row.length; x += 2) {
        const char = row[x];
        const realX = x / 2;

        switch (char) {
        case 'W': this.wallPositions.push({ x: realX, y: y }); break;
        case 'E': this.enemyPositions.push({ x: realX, y: y }); break;
        case 'A': this.ammoPickupPositions.push({ x: realX, y: y }); break;
        case 'H': this.healthPickupPositions.push({ x: realX, y: y }); break;
        case 'P': this.playerPosition = { x: realX, y: y }; break;
        }
      }
    }
  }

  newMapConfiguration () {
    this.playerPosition = {
      x: 0,
      y: 0
    };
    this.enemyPositions = [];
    this.wallPositions = [];
    this.ammoPickupPositions = [];
    this.healthPickupPositions = [];
  }

  getPlayerPosition () {
    return this.playerPosition;
  }

  getEnemyPositions () {
    return this.enemyPositions;
  }

  getWallPositions () {
    return this.wallPositions;
  }

  getAmmoPickupPositions () {
    return this.ammoPickupPositions;
  }

  getHealthPickupPositions () {
    return this.healthPickupPositions;
  }
}