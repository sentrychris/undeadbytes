/**
 * Game utilities.
 * 
 * @category Game
 * @memberof Game
 * @module utility
 */

/**
 * Generate a random number.
 * 
 * @param {number} min - the minimum number
 * @param {number} max - the maximum number
 * 
 * @returns {number}
 */
export function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Pick a random element from an array.
 * 
 * @param {array} arr - the array
 * 
 * @returns {*}
 */
export function randomFromArray (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random hex color code.
 * 
 * @returns {string}
 */
export function randomColor () {
  // return '#'+(Math.random() * 0x008000 << 0).toString(16);
  const hue = randomNumber(0, 250);
  const saturation = randomNumber(0, 35);
  const light = randomNumber(35, 55);

  return 'hsl(' + hue + ', ' + saturation + '%, ' + light + '%)';
}

/**
 * Create a timestamp.
 * 
 * @param {boolean} condense - remove separators e.g. "-" or "/"
 * 
 * @returns {string}
 */
export function timestamp (condense = false) {
  const date = (new Date()).toISOString()
    .slice(0, 19)
    .replace('T', condense ? '' : ' ');

  return condense ? date.replace(/[:-]/g, '') : date;
}

/**
 * Determine whether game element is active.
 * 
 * @param {HTMLElement} elem - the HTML element
 * 
 * @returns {boolean}
 */
export function isActiveElement (elem) {
  return ! elem.classList.contains('inactive');
}

/**
 * Get the execution context bridge.
 * 
 * @returns {string|Object}
 */
export function getExecutionBridge () {
  if (Object.prototype.hasOwnProperty.call(window, 'executionBridge')
  && window.executionBridge !== null) {
    return window.executionBridge;
  }

  return 'web';
}

/**
 * Setup WASD keyboard tracking for the UI
 * 
 * @returns {void}
 */
export function trackWASDKeyboard () {
  function wasd (e) {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (
      e.key === 'w' ||
      e.key === 'a' ||
      e.key === 's' ||
      e.key === 'd'
    ) {
      if (key) key.classList.add('keyboard__key--active');
    }
  }

  window.addEventListener('keydown', wasd);
  window.addEventListener('keyup', (e) => {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (key) key.classList.remove('keyboard__key--active');
  });
}

/**
 * Log the running game state to the console
 * 
 * @param {Game} game 
 * @param {number} interval 
 */
export function logGameStateToConsole (game, interval = 2000) {
  console.debug(
    '%c Logging game data to console',
    'background: #222; color: yellow'
  );

  console.debug(
    `%c Refreshes every ${((interval % 60000) / 1000).toFixed(2)} seconds`,
    'background: #222; color: yellow'
  );
  
  function calculate (obj) {
    return (
      obj.walls.length +
      obj.enemies.length +
      obj.ammoPickups.length +
      obj.healthPickups.length
    ) + 1; // game player;
  }
  
  setInterval(() => {
    const walls   = `W: ${game.walls.length} | `;
    const enemies = `E: ${game.enemies.length} | `;
    const ammo    = `A: ${game.ammoPickups.length} | `;
    const health  = `H: ${game.healthPickups.length} | `;
    const stamina = `S: ${game.staminaPickups.length}`;

    const entities = walls + enemies + ammo + health + stamina;

    console.debug(`%c Player Health: ${game.player.health}`, 'background: #222; color: #bfff00');
    console.debug(`%c Enemies Alive: ${game.enemies.length}`, 'background: #222; color: #FF033E');
    console.debug(`%c Gameover State: ${game.gameover}`, 'background: #222; color: #00ffff');
    
    console.debug('%c Entity Data:', 'background: #222; color: #ffffff');
    console.debug(
      `%c Total: ${game.entities.length} | Curr: ${calculate(game)}`,
      'background: #222; color: #ffffff'
    );
    console.debug(
      `%c ${entities}\n\n`,
      'background: #222; color: #ffffff'
    );
  }, interval);
}