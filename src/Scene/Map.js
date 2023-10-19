import { LevelTwo } from './Levels/LevelTwo';

export class Map
{
  constructor() {
    this.playerPosition = {
      x: 0,
      y: 0
    };
    this.enemyPositions = [];
    this.wallPositions = [];
  }

  generate () {
    for (let y = 0; y < LevelTwo.length; y++) {
      const row = LevelTwo[y];

      for (let x = 0; x < row.length; x += 2) {
        const char = row[x];
        const realX = x / 2;

        switch (char) {
          case 'W': this.wallPositions.push({ x: realX, y: y }); break;
          case 'E': this.enemyPositions.push({ x: realX, y: y }); break;
          case 'P': this.playerPosition = { x: realX, y: y }; break;
        }
      }
    }
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
}