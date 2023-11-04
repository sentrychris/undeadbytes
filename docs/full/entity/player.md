# Player

## Overview

The `Player` class represents a player entity within the game. This class encapsulates the properties and behaviors of the player, including movement, rendering, health management, and interactions with other entities such as enemies, walls and power-ups.

## Class Structure

### Properties

1. **type**: A string representing the type of entity. In this case, it is set to 'player'.
2. **bounding**: A string specifying the entity's bounding behavior. It is set to 'arc'.
3. **x, y**: Numeric values representing the player's coordinates.
4. **angle**: The angle of the player entity.
5. **position**: A value representing the player's position.
6. **incrementer**: A value used as a speed incrementer for animation.
7. **speed**: The player's movement speed.
8. **stamina**: A boolean indicating whether the player's stamina boost is enabled.
9. **staminaAmount**: The amount of speed boost when stamina is activated.
10. **sleep**: A boolean representing the player's render state.
11. **invincible**: A boolean indicating whether the player is in an invincible state.
12. **health**: The player's health, initialized to 100.
13. **pickups**: An object containing counts for health and stamina pickups.
14. **damage**: An object representing the damage vector inflicted on the player.
15. **dead**: A boolean indicating whether the player is dead.

### Methods

1. **Constructor(spawn)**: Initializes the player entity with spawn coordinates and sets default values for various properties.
   
2. **render(context)**: Renders the player entity on the canvas using the `Renderer` class.

3. **update(game)**: Updates the player entity's position, speed, and angle based on user input, collisions with walls, and mouse position. It also handles animation and invincibility states.

4. **takeDamage(enemy)**: Handles damage inflicted on the player by enemies, considering the player's invincibility state.

5. **boostSpeed(amount)**: Boosts the player's speed for a short duration when a stamina pickup is acquired.

6. **refillHealth(amount, pickup)**: Refills the player's health when a health pickup is acquired or used.

## Rendering and Updating

### Render Method

The `render` method delegates the rendering responsibility to the `Renderer` class, which abstracts the rendering logic. This separation allows for modular rendering and enhances code readability.

### Update Method

The `update` method is responsible for updating the player's position, handling user input, checking collisions, managing animation, and adjusting the player's angle based on the mouse position. The method also handles damage inflicted by enemies and updates the player's health accordingly.

## Interactions

### Damage Handling

The `takeDamage` method calculates the damage vector based on the player's position relative to an enemy. If the player is not invincible, it applies damage, triggers invincibility, and updates the player's health. If the player's health reaches zero, the player is marked as dead.

### Pickup Handling

The `boostSpeed` and `refillHealth` methods handle the activation of stamina and health pickups, respectively. The player's properties are adjusted based on the type of pickup and whether it is acquired or used.