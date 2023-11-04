# Game Loop

The game loop is a fundamental concept in Undead Bytes' game development, responsible for repeatedly updating and rendering the game state to create the illusion of continuous motion. Let's break down the components of this game loop:

## Method: `loop()`

1. **`this.stats.begin()`**: Starts the performance monitoring. This allows tracking of the frames per second (FPS), ensuring efficient game performance.

2. **`AudioFX.soundtrack()`**: Initiates the playback of the game's soundtrack or background music.

3. **`if (!this.stopped)`**: Checks if the game is not stopped. If the game is not stopped, the following actions are executed; otherwise, the loop is paused.

    - **`this.frame = null`**: Resets the frame variable to null. This variable is likely used to keep track of the current frame being processed.

    - **`this.onUpdate()`**: Invokes the `onUpdate` method of the game manager, responsible for updating the game state, including entities and game logic.

    - **`this.onRender()`**: Invokes the `onRender` method of the game manager, responsible for rendering the updated game state on the canvas.

7. **`if (this.gameover)`**: Checks if the gameover flag is true, indicating that the game has ended.

   - **`this.displayGameEnd()`**: If the game is over, a method `displayGameEnd` is called, likely responsible for showing an end-of-game screen or messages.

   - **`this.restart()`**: The `restart` method is called, indicating that the game is ready to be restarted or reset to its initial state.

8. **`this.stats.end()`**: Ends the performance monitoring for the current frame.

9. **`this.run()`**: Initiates the next iteration of the game loop by recursively calling the `run` method. This sets the loop in motion, creating a continuous cycle of updating and rendering until the game is stopped or the loop is interrupted.

## Conclusion

The `loop` method orchestrates the essential steps of the game loop, including updating and rendering the game state, handling game-over scenarios, and ensuring continuous execution for a seamless gaming experience.