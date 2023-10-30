## `arcBoxCollision(params)`

The `arcBoxCollision` method is a specialized function within the `Collision` class designed specifically for detecting collisions between an arc-shaped entity (potentially representing the player) and a rectangular box-shaped entity (potentially representing a wall) in the game world.

### Parameters:

- **`params`** (Object): An object containing properties necessary for the collision check.
- **`arcX`** (number): The x-coordinate of the arc entity.
- **`arcY`** (number): The y-coordinate of the arc entity.
- **`rectX`** (number): The x-coordinate of the box entity.
- **`rectY`** (number): The y-coordinate of the box entity.
- **`size`** (number): The size of the box entity.
- **`radius`** (number): The radius of the arc entity.

### Logic:

1. **Distance Calculation:**
    ```js
    const distX = Math.abs(arcX - rectX - size / 2);
    const distY = Math.abs(arcY - rectY - size / 2);
    ```
    - The method starts by calculating the distance between the center of the arc entity and the center of the box entity along both the x and y axes.

2. **Overlap Check:**
    ```js
    if (distX > size / 2 + radius || distY > size / 2 + radius) {
      return false;
    }
    ```
    - It then checks if the distance along the x-axis is greater than the sum of the sizes of the arc and the box. If true, there is no overlap along the x-axis, and the method returns `false`.
    - Similarly, it checks if the distance along the y-axis is greater than the sum of the sizes. If true, there is no overlap along the y-axis, and the method returns `false`.

3. **Collision Check:**

    If the above conditions are not met in the overlap check, the method proceeds to check for collision in more detail:
    ```js
    if (distX <= (size / 2) || distY <= (size / 2)) {
      return true;
    }
  
    const dX = distX - size / 2;
    const dY = distY - size / 2;
  
    return (dX * dX + dY * dY <= (radius * radius));
    ```
      - If the distance along the x-axis is less than or equal to half the size of the box, there is a collision along the x-axis.
      - If the distance along the y-axis is less than or equal to half the size of the box, there is a collision along the y-axis.
      - It performs a circular collision check to ensure the arc does not intersect with the corners of the box.

4. **Result:**
   - If any of the collision conditions are met, the method returns `true`, indicating a collision between the arc and the box. Otherwise, it returns `false`.

### Purpose:

The primary purpose of this method is to determine whether an arc-shaped entity, such as the player, is in collision with a box-shaped entity, such as a wall. It takes into account both the size of the box and the radius of the arc, ensuring an accurate collision detection mechanism that considers the geometry of the entities involved.