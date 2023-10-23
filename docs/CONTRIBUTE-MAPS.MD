# Contribute a map!

If you would like to contribute a map, please feel free to build one and submit a pull request for review and potential inclusion in the next release!

## How to submit a map

1. Fork the repository
2. Create a new branch named `level/level<number>`, e.g.:
    ```
    git checkout -b level/level5
    ```
3. Create a new level in `src/lib/Levels/`, increment it from the last available level, e.g.:
    ```
    touch src/lib/Levels/level5.js
    ```
4. Create your map in the same format as the example above, don't forget to change the export const name to the same name as the level e.g:
    ```js
    export const level5 = [...]
    ```
5. Open a PR to merge your branch into the Squareshoot `main` branch.

## Map Structure

Maps are incredibly straightforward, here is the map for level 1, located at `src/lib/Levels/level1.js`:

```js
export const level1 = [
  'W W W W W W W W W W W W W W W W W W W W',
  'W       W                             W',
  'W   A   W                       H     W',
  'W   E   W                             W',
  'W       W           E     W W W W W W W',
  'W     W W                             W',
  'W                   E                 W',
  'W         E                     E     W',
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

### Map entities

The map is made up of characters which represent where the following entities will be placed when the map is generated:

- **W**: Denotes where walls will be placed.
- **A**: Denotes where ammo pick-ups will be placed.
- **H**: Denotes where health pick-ups will be placed.
- **E**: Denotes where enemies will spawn.
- **P**: Denotes where the player will spawn.

### Alignment

Entities must be aligned! For example:

```
  'W W W W',
  'W  E  W',
  'W     W',
```

This enemy will not spawn, because it is aligned in between the wall. Think of the wall as a grid, and entities as points that must be plotted along the x,y axes.

The following example is the corrected version:

```
  'W W W W',
  'W   E W',
  'W     W',
```

### Design

Here are some tips to help you design fun and challenging levels that people will want to play.

Think carefully about enemy placement and the weapons the player has available to them, for example:

- Placing large numbers of enemies in narrow corriders will require players to use weapons with a larger spread for crowd control
- Large open areas will provide players with the opportunity to engage enemies from a distance and manoeuvre around more easily
- Single blocks in spaces and corriders will provide players with both extra cover and extra obstacles to work around

All of these things and more should be taken into consideration when designing a level.

Happy building! :)
