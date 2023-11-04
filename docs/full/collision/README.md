# Collision

## Pages

* [Arc-box collision](./arc-box-collision.md)
* [Entity-to-player](./entity-to-player.md)
* [Entity-to-walls](./entity-to-walls.md)


The `Collision` class provides methods for detecting collision between entities in the game environment and handling behaviour.

## `intersection(r1, r2)`

```js
static intersection (r1, r2) {
  return ! (r1.x + r1.width < r2.x
    || r1.y + r1.height < r2.y
    || r1.x > r2.x + r2.width
    || r1.y > r2.y + r2.height
  );
}
```

This method is a basic collision check that determines if two entities, defined by their rectangular properties (x, y, width, height), intersect. The logic is straightforward: if any side of one entity is positioned to the left, right, above, or below the other, they do not intersect. Otherwise, they overlap, triggering a collision.

## `distance(e1, e2, useVectors = true)`

```js
static distance (e1, e2, useVectors = true) {
  if (useVectors) {
    return Math.sqrt(e1*e1 + e2*e2);
  }

  const vectorX = e1.x - e2.x;
  const vectorY = e1.y - e2.y;

  return Math.sqrt(vectorX*vectorX + vectorY*vectorY);
}
```

The `distance` method calculates the Euclidean distance between two points in space. It's versatile, accepting either entity objects or numerical values as parameters. When `useVectors` is set to `true`, the method considers the parameters as vector components, determining the distance between the points they represent. This is foundational for measuring the spatial separation between entities, a key factor in collision detection.

## `arcBoxCollision(params)`

This method is specifically tailored for collision detection between an arc-shaped entity (possibly the player) and a box-shaped entity (possibly a wall). By leveraging geometric calculations, it checks if the arc is within a certain distance from the box.

View [here](arc-box-collision.md) for more details.

## `entityToWalls(entity, walls)`

`entityToWalls` is responsible for detecting collisions between a given entity and an array of wall entities. It iterates through the array, employing [`arcBoxCollision`](arc-box-collision.md) for each wall. By accumulating collision vectors, it provides a result that adjusts the entity's position, preventing it from passing through walls. This method is crucial for maintaining the integrity of the game environment and ensuring entities interact appropriately with obstacles.

View [here](entity-to-walls.md) for more details.

## `entityToPlayer(entity, game, { on, onDistance, callback })`

The `entityToPlayer` method handles collisions between an entity (e.g., enemy or pickup item) and the player. It calculates the vector between the entity and the player. Depending on the entity type, various actions are triggered, such as damaging the player, or invoking a callback.

View [here](entity-to-player.md) for more details.

# Summary
In essence, the `Collision` class is a fundamental part of the game engine's collision detection system. It provides a set of tools for entities to interact realistically with each other and the game environment, ensuring a dynamic and engaging gaming experience.