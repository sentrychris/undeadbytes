/**
 * Weapons mapping for the bullet factory.
 * 
 * Weapons are mapped by array index to hotkey.
 */
export const mappings = [
  {
    name: 'Pistol',
    spread: {
      min: 0,
      max: 0,
    },
    dps: 30,
    dropoff: 40,
    clip: 10,
    capacity: 10,
    magazines: 2,
    magazinesTotal: 2,
    bulletColor: '#F8CA00',
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
    dropoff: 25,
    clip: 6,
    capacity: 6,
    magazines: 2,
    magazinesTotal: 2,
    bulletColor: '#F8CA00',
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
    dropoff: 40,
    clip: 225,
    capacity: 225,
    magazines: 1,
    magazinesTotal: 1,
    bulletColor: ['#CC5500', '#F8CA00'],
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
    dropoff: 20,
    clip: 600,
    capacity: 600,
    magazines: 2,
    magazinesTotal: 2,
    bulletColor: ['#CC5500', '#F8CA00'],
    automatic: true,
    audioFire: './fx/audio/flamethrower/flamethrower-fire.mp3',
    audioReload: './fx/audio/flamethrower/flamethrower-reload.mp3'
  }
];