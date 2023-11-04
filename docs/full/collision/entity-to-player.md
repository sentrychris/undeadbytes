## `entityToPlayer(entity, game, { on, onDistance, callback })`

The `entityToPlayer` method manages collisions between a given entity and the player in the game environment.

### Parameters:

- **`entity`** (Object): The entity for which collisions are being checked.
- **`game`** (Object): The game context containing information about the player and other game elements.
- **`on`** (string): An option to define the type of entity to execute a callback on
- **`onDistance`** (number): An option to define the distance between the entity and the player to trigger the callback.
- **`callback`** (Function): An option to define the callback function that is executed when the conditions are met.

### Logic:

1. **Determine Position Vectors:**
   ```javascript
   let vectorX = game.player.x - entity.x;
   let vectorY = game.player.y - entity.y;
   ```
   The method calculates the vector between the player and the entity's current position.

2. **Handling Dead Player:**
   ```javascript
   if (game.player.dead) {
     vectorX = entity.lastVectorX;
     vectorY = entity.lastVectorY;
   } else {
     entity.lastVectorX = vectorX;
     entity.lastVectorY = vectorY;
   }
   ```
   If the player is dead, the entity's position is set to their last known position; otherwise, the last known position is updated.

3. **Determine Distance:**
   ```javascript
   const distance = Collision.distance(vectorX, vectorY);
   ```
   The method calculates the distance between the player and the entity.

4. **Entity Type Check:**
   ```javascript
   if (callback && on === entity.type && distance <= onDistance) {
      callback();
   }
   ```
   If the entity type matches the passed callback object information and the distance to the player is within the trigger range, the optional callback function is executed.

5. **Enemy Type Check:**
   ```javascript
   if (distance > 0 && entity.type === 'enemy') {
   ```
   For enemy entities, the method proceeds if the distance to the player is greater than 0.

6. **Distance Check for Enemy:**
   ```javascript
   if (distance < 800) {
   ```
   If the distance to the player is less than 800, adjust the entity's angle and position toward the player.

7. **Update Entity Position:**
   ```javascript
   entity.angle = Math.atan2(vectorY, vectorX) - 90 * Math.PI / 180;
   entity.x += vectorX * entity.speed;
   entity.y += vectorY * entity.speed;
   ```
   The entity's angle and position are updated based on the vector between the player and the entity.

8. **Collision with Walls:**
   ```javascript
   const collisionVector = Collision.entityToWalls(entity, game.walls);
   entity.x += collisionVector.x * entity.speed;
   entity.y += collisionVector.y * entity.speed;
   ```
   The method checks for collisions with walls using `entityToWalls` and adjusts the entity's position accordingly.

9. **Enemy Momentum Adjustment:**
   ```javascript
   entity.incrementer += entity.speed;
   entity.position = Math.sin(entity.incrementer * Math.PI / 180);
   ```
   The entity's momentum is used to adjust the angle until it works its way around obstacles.

10. **Player Hurt Check:**
    ```javascript
    if (distance < 100 && entity.type === 'enemy') {
      game.player.takeDamage(entity);
    }
    ```
    If the distance to the player is less than 100, the player takes damage from the enemy.

### Purpose:

The primary purpose of the `entityToPlayer` method is to handle collisions between a given entity and the player in the game environment. It ensures that entities respond realistically to the player's presence, adjusting their positions, angles, and interactions based on distance and game context.