export function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function trackWASD() {
  function wasd(e) {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (
      e.key === "w" ||
      e.key === "a" ||
      e.key === "s" ||
      e.key === "d"
    ) {
      if (key) key.classList.add("keyboard-key__active");
    }
  }

  window.addEventListener("keydown", wasd);
  window.addEventListener("keyup", (e) => {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (key) key.classList.remove('keyboard-key__active');
  });
}