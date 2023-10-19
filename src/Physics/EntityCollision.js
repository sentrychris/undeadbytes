export class _EntityCollision
{
  /**
   * Caclulate collision beween entity (arc) and wall (box)
   * 
   * @param {*} param0 
   * @returns 
   */
  arcWallVector({ arcX, arcY, radius, wallX, wallY, size }) {
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
   * Calculate collision vectors
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} walls 
   * @returns 
   */
  calculateVector(x, y, walls) {
    const result = {
      x: 0,
      y: 0
    };

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
  
      if (this.arcWallVector({
        arcX: x,
        arcY: y,
        radius: 60,
        wallX: wall.x,
        wallY: wall.y,
        size: 150
      })) {
        const wallCenterX = wall.x + 150 / 2;
        const wallCenterY = wall.y + 150 / 2;
  
        let vectorX = x - wallCenterX;
        let vectorY = y - wallCenterY;
  
        const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
  
        if (length > 0) {
          vectorX /= length;
          vectorY /= length;
  
          result.x += vectorX;
          result.y += vectorY;
        }
      }
    }
  
    return result;
  }
}

export const EntityCollision = new _EntityCollision();