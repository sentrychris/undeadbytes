export function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isActiveElement (elem) {
  return ! elem.classList.contains('inactive');
}

export function getExecutionBridge () {
  if (Object.prototype.hasOwnProperty.call(window, 'executionBridge')
  && window.executionBridge !== null) {
    return window.executionBridge;
  }

  return 'web';
}

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

export function logGameStateToConsole (game, interval = 2000) {
  console.log(
    '%c Logging game data to console',
    'background: #222; color: yellow'
  );

  console.log(
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
    const entities = `W: ${game.walls.length} | E: ${game.enemies.length} | A: ${game.ammoPickups.length} | H: ${game.healthPickups.length}`;

    console.log(`%c Player Health: ${game.player.health}`, 'background: #222; color: #bfff00');
    console.log(`%c Enemies Alive: ${game.enemies.length}`, 'background: #222; color: #FF033E');
    console.log(`%c Gameover State: ${game.gameover}`, 'background: #222; color: #00ffff');
    
    console.log('%c Entity Data:', 'background: #222; color: #ffffff');
    console.log(
      `%c Total: ${game.entities.length} | Curr: ${calculate(game)}`,
      'background: #222; color: #ffffff'
    );
    console.log(
      `%c ${entities}\n\n`,
      'background: #222; color: #ffffff'
    );
  }, interval);
}