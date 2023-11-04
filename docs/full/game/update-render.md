# Game - `onUpdate` and `onRender` Methods

## Overview

The `Game` class is responsible for managing entities within the game loop.

Two crucial methods, `onUpdate` and `onRender`, orchestrate the updating and rendering of entities during the game loop. These methods ensure that the player, enemies, pickups, and other entities are appropriately handled for smooth gameplay.

## `onUpdate` Method

The `onUpdate` method is responsible for updating entities during each iteration of the game loop, primarily focusing on the player and enemy entities. Let's break down its functionality:

### Camera and Ballistics Update

1. **Camera Update**: The method starts by updating the game camera, ensuring that it follows the player's movements. This is crucial for keeping the player centered within the game view.

2. **Ballistics Update**: The ballistics system is updated, which handles things like projectile movements and other ballistic-related calculations within the game such as spread, velocity and drop-off.

### Entity Updates

3. **Entity Iteration**: A loop iterates over all entities in the game.

4. **Conditional Entity Update**: The `update` method of each entity is called if it satisfies conditions specified in `canUpdateEntity`. This method ensures that only entities requiring updates are processed.

5. **Player State Check**: A check for the player entity's state is performed. If the player is dead, the gameover flag is set to true.

6. **Enemy State Check**: If all enemies are dead, the gameover and levelPassed flags are set to true, indicating that the player has successfully completed the level.

7. **Pickup Removal**: If a pickup entity is marked for deletion (`markToDelete` is true), it is removed from the `entities` array.

8. **UI Update**: The number of remaining enemies is updated in the game's user interface.

## `onRender` Method

The `onRender` method handles the rendering of entities during each frame of the game loop. It sets up the scene, performs pre-render actions, renders entities, and completes post-render tasks. Let's delve into its components:

### Camera Operations

1. **New Scene Setup**: Prepares for rendering a new scene by clearing the canvas.

2. **Pre-render Operations**: Performs pre-render operations, such as adjusting the camera based on the player's position. This ensures that the player remains centered within the game view.

### Entity Rendering

3. **Ballistics Rendering**: Renders the ballistics system, potentially displaying projectiles or other ballistic-related visual elements.

4. **Entity Iteration for Rendering**: A loop iterates over all entities, and each entity's `render` method is called. This includes rendering the player, enemies, pickups, and any other entities present in the game.

### Camera Finalization

5. **Post-render Operations**: Completes post-render operations, finalizing the rendering process and restoring the state for the next frame.

## Integration with Player Entity

### `Player` Entity Update

The `onUpdate` method specifically targets the player entity by checking its type. If the player is not dead, the `update` method of the player entity is called. This ensures that the player's position, speed, and other attributes are updated according to user input and game logic.

### `Player` Entity Render

In the `onRender` method, the player entity's `render` method is called, ensuring that the player is visually represented on the canvas.

## Conclusion

The `onUpdate` and `onRender` methods in the `Game` class play a pivotal role in coordinating the game loop's entity updates and rendering processes.

The integration with the `Player` entity ensures that the player's state is consistently updated and visually reflected in the game.