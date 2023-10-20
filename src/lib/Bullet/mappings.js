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
    clip: 2,
    capacity: 2,
    magazines: 2,
    automatic: false
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
    automatic: false
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
    automatic: true
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
    automatic: true
  }
];