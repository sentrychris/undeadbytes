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
    min: 0,
    max: 0,
    dps: 30,
    automatic: false
  },
  {
    name: 'Shotgun',
    min: -3,
    max: 3,
    dps: 35,
    automatic: false
  },
  {
    name: 'Machine Gun',
    min: 0,
    max: 0,
    dps: 20,
    automatic: true
  },
  {
    name: 'Flamethrower',
    min: -5,
    max: 5,
    dps: 10,
    automatic: true
  }
];