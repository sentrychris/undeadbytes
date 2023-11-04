# Map

The `Map` class manages the configuration and generation of game maps. Maps are represented as arrays of strings, where each character denotes a different game entity such as walls, enemies, pickups, and the player.

## Map Configuration

### Level Representation

A level is represented as an array of strings, where each character denotes a specific game entity:

- 'W': Wall
- 'E': Enemy
- 'A': Ammo Pickup
- 'H': Health Pickup
- 'S': Stamina Pickup
- 'P': Player

### Example Level Configuration

```javascript
const level1 = [
  'W W W W W W W W W W W W W W W W W W W W',
  'W       W                             W',
  'W   A   W   S     E             H     W',
  'W   E   W                             W',
  'W       W           E     W W W W W W W',
  'W     W W                             W',
  'W                   E                 W',
  'W         E               S     E     W',
  'W                                     W',
  'W W W W W W W W W W W W W W           W',
  'W                         W           W',
  'W   H A E                 W           W',
  'W                   E     W           W',
  'W W W W W W W             W           W',
  'W                         W     E     W',
  'W               W W W W W W           W',
  'W   P                     W           W',
  'W                                     W',
  'W         W W W                   E   W',
  'W           W       E                 W',
  'W W W W W W W W W W W W W W W W W W W W'
];
```

## Properties

- `levels`: (array) stores all level maps.
- `playerPosition`: The current x,y coordinates of the player.
- `enemyPositions`: Array of enemy x,y coordinates.
- `wallPositions `: Array of wall x,y coordinates.
- `ammoPickupPositions `: Array of ammo pickup x,y coordinates.
- `healthPickupPositions  `: Array of health pickup x,y coordinates.
- `staminaPickupPositions  `: Array of stamina pickup x,y coordinates.

These properties collectively define the state and configuration of the game map including the layout and position of all entities for rendering.

## Methods

### Constructor

```javascript
constructor()
```

Initializes a new `Map` instance with default values and loads the level configurations.

### `newMapConfiguration()`

```javascript
newMapConfiguration()
```

Resets all entity positions to their default values, placing the player at the top-left corner and clearing arrays for enemies, walls, ammo pickups, health pickups, and stamina pickups.

### `generate(levelIndex)`

```javascript
generate(levelIndex = 1)
```

Generates a new map based on the specified `levelIndex`. Processes the corresponding level configuration and updates position arrays for entities.

- **levelIndex** (number, optional): The index of the level configuration to use, default is 1.

### `getPlayerPosition()`

```javascript
getPlayerPosition()
```

Returns the current player position as an object with x and y coordinates.

### `getEnemyPositions()`

```javascript
getEnemyPositions()
```

Returns an array of enemy positions, each represented as an object with x and y coordinates.

### `getWallPositions()`

```javascript
getWallPositions()
```

Returns an array of wall positions, each represented as an object with x and y coordinates.

### `getAmmoPickupPositions()`

```javascript
getAmmoPickupPositions()
```

Returns an array of ammo pickup positions, each represented as an object with x and y coordinates.

### `getHealthPickupPositions()`

```javascript
getHealthPickupPositions()
```

Returns an array of health pickup positions, each represented as an object with x and y coordinates.

### `getStaminaPickupPositions()`

```javascript
getStaminaPickupPositions()
```

Returns an array of stamina pickup positions, each represented as an object with x and y coordinates.