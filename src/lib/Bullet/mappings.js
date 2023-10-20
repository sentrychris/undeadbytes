/**
 * Weapons mapping for the bullet factory.
 * 
 * Weapons are mapped by array index to hotkey.
 * 
 * name - Name of the weapon to display
 * min/max - The weapon's fire spread
 * dps - The weapon's damage per second
 * automatic - The weapon has automatic fire 
 */
export const mappings = [
  {
    name: 'Pistol',
    spread: {
      min: 0,
      max: 0,
    },
    dps: 30,
    clip: 20,
    capacity: 20,
    magazines: 2,
    automatic: false,
    audioFire: './fx/audio/pistol/pistol-fire.mp3',
    audioReload: './fx/audio/pistol/pistol-reload.mp3'
  },
  {
    name: 'Shotgun',
    spread: {
      min: -3,
      max: 3,
    },
    dps: 50,
    clip: 20,
    capacity: 20,
    magazines: 2,
    automatic: false,
    audioFire: './fx/audio/shotgun/shotgun-fire.mp3',
    audioReload: './fx/audio/shotgun/shotgun-reload.mp3'
  },
  {
    name: 'Machine Gun',
    spread: {
      min: 0,
      max: 0,
    },
    dps: 15,
    clip: 150,
    capacity: 150,
    magazines: 2,
    automatic: true,
    audioFire: './fx/audio/machine-gun/machine-gun-fire.mp3',
    audioReload: './fx/audio/machine-gun/machine-gun-reload.mp3'
  },
  {
    name: 'Flamethrower',
    spread: {
      min: -5,
      max: 5,
    },
    dps: 10,
    clip: 300,
    capacity: 300,
    magazines: 2,
    automatic: true,
    audioFire: './fx/audio/flamethrower/flamethrower-fire.mp3',
    audioReload: './fx/audio/flamethrower/flamethrower-reload.mp3'
  }
];