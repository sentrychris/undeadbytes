# Enemy

The `Enemy` class represents an enemy entity within the game. This class encapsulates the properties and behaviors of enemies, including rendering, updating, collision handling, and response to projectile hits.

## Class Structure

### Properties

1. **type**: A string representing the type of entity. In this case, it is set to 'enemy'.
2. **bounding**: A string specifying the entity's bounding behavior. It is set to 'arc'.
3. **x, y**: Numeric values representing the enemy's coordinates.
4. **angle**: The angle of the enemy entity.
5. **position**: A value representing the enemy's position.
6. **incrementer**: A value used as a speed incrementer for animation.
7. **speed**: The enemy's movement speed.
8. **sleep**: A boolean representing the enemy's render state.
9. **pushAlongVelocity**: An object representing the velocity applied when an enemy is pushed by another entity.
10. **projectileHitVelocity**: An object representing the velocity applied when the enemy is hit by a projectile.
11. **canBeHitByProjectile**: A boolean indicating whether the enemy can be hit by a projectile.
12. **lastVectorX, lastVectorY**: Last recorded vector components used for projectile hit velocity calculation.
13. **health**: The enemy's health, initialized to 100.
14. **dead**: A boolean indicating whether the enemy is dead.
15. **allEnemiesDead**: A boolean indicating whether all enemies in the game are dead.

### Methods

1. **Constructor(spawn)**: Initializes the enemy entity with spawn coordinates and sets default values for various properties.

2. **render(context)**: Renders the enemy entity on the canvas using the `Renderer` class.

3. **update(game)**: Updates the enemy entity's position, handles enemy-enemy collisions, checks for projectile hits, and updates the entity's health and state.

4. **pushAlong(vectorX, vectorY)**: Sets the push velocity to push enemies when bumped by entities.

5. **hitByProjectile(projectile, dps, enemies)**: Sets the enemy's velocity and handles damage per second (DPS) when enemies are hit by projectiles.

## Rendering and Updating

### Render Method

The `render` method delegates the rendering responsibility to the `Renderer` class, ensuring a separation of concerns and maintaining a modular structure.

### Update Method

The `update` method is responsible for updating the enemy entity's position, handling enemy-enemy collisions, responding to projectile hits, and updating health and state. It ensures that the enemy's state is updated based on various interactions within the game.

## Interaction with Other Entities

### Enemy-Enemy Collision

In the `update` method, there is a section that checks for enemy-enemy collisions. If the distance between two enemies is within a specified range, one enemy pushes the other, simulating a collision response.

### Projectile Hit Handling

The `update` method also checks for projectile hits by iterating over projectiles in the game. If a projectile intersects with the enemy's bounds, the `hitByProjectile` method is called, applying damage and potentially marking the enemy as dead.