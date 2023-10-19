export const map = [
  'W W W W W W W W W W W W W W W W W W W W',
  'W       W                             W',
  'W   E   W           E           E     W',
  'W   E   W                             W',
  'W       W           E     W W W W W W W',
  'W     W W                             W',
  'W                   E                 W',
  'W         E E                   E     W',
  'W                                     W',
  'W W W W W W W W W W W W W W           W',
  'W                         W           W',
  'W     E     E             W     E     W',
  'W                   E     W           W',
  'W W W W W W W             W           W',
  'W                         W     E     W',
  'W               W W W W W W           W',
  'W   P                     W           W',
  'W                   E                 W',
  'W         W W W                   E   W',
  'W           W       E                 W',
  'W W W W W W W W W W W W W W W W W W W W'
];

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
    for (let y = 0; y < map.length; y++) {
      const row = map[y];

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