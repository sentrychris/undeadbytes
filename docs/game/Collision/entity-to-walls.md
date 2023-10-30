## `entityToWalls(entity, walls)`

The `entityToWalls` method is responsible for handling collisions between a given entity and an array of walls in the game environment.

### Parameters:

- **`entity`** (Object): The entity for which collisions are being checked.
- **`walls`** (Array): An array containing the wall entities in the game.

### Logic:

1. **Result Initialization:**
   ```javascript
   const result = {
     x: 0,
     y: 0
   };
   ```
   The method initializes a result object to store the cumulative collision vectors along the x and y axes.

2. **Iterating Through Walls:**
   ```javascript
   for (let i = 0; i < walls.length; i++) {
     const wall = walls[i];
   ```
   The method iterates through each wall in the array.

3. **Arc-Wall Collision Check:**
   ```javascript
   if (Collision.arcWallVector({
     arcX: entity.x,
     arcY: entity.y,
     radius: 60,
     wallX: wall.x,
     wallY: wall.y,
     size: config.cell.size
   })) {
   ```
   It checks for collision between the arc-shaped entity and the rectangular wall using the [`arcWallVector`](#arc-wall-vector) method.

4. **Collision Handling:**
   ```javascript
   const wallCenterX = wall.x + config.cell.size / 2;
   const wallCenterY = wall.y + config.cell.size / 2;
   
   let vectorX = entity.x - wallCenterX;
   let vectorY = entity.y - wallCenterY;
   
   const distance = Collision.distance(vectorX, vectorY);
   ```

   If a collision is detected, the method calculates the vector between the center of the wall and the entity, along with the distance between them.

5. **Cumulative Collision Vectors:**
   ```javascript
   if (distance > 0) {
     vectorX /= distance;
     vectorY /= distance;
   
     result.x += vectorX;
     result.y += vectorY;
   }
   ```
   The method updates the cumulative collision vectors based on the normalized vector between the entity and the wall.

6. **Result:**
   ```javascript
   return result;
   ```
   Finally, the method returns the cumulative collision vectors, which will be used to adjust the entity's position to avoid collisions with walls.

### Purpose:

The primary purpose of the `entityToWalls` method is to handle collisions between an entity and an array of walls in the game environment. It utilizes the [`arcWallVector`](#arc-wall-vector.md) method to check for collisions with each wall individually, and the cumulative collision vectors are then used to adjust the entity's position.

This functionality is crucial for ensuring that entities navigate the game world realistically, responding to the presence of walls to prevent phasing through them.