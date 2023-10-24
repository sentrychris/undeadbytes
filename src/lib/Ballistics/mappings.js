/**
 * Weapons mapping for the bullet factory.
 * 
 * Weapons are mapped by array index to hotkey.
 */
export const mappings = [
  {
    name: 'Pistol',
    type: 'gun',
    projectile: {
      color: '#F8CA00',
      spread: {
        min: 0,
        max: 0,
      },
      dps: 30,
      dropoff: 40,
    },
    clip: {
      current: 10,
      capacity: 10
    },
    magazines: {
      current: 2,
      capacity: 2
    },
    trigger: false,
    audio: {
      type: 'repeat',
      fire: './fx/audio/pistol/pistol-fire.mp3',
      reload: './fx/audio/pistol/pistol-reload.mp3'
    }
  },
  {
    name: 'Shotgun',
    type: 'gun',
    projectile: {
      color: '#F8CA00',
      spread: {
        min: -3,
        max: 3,
      },
      dps: 50,
      dropoff: 25,
    },
    clip: {
      current: 6,
      capacity: 6
    },
    magazines: {
      current: 2,
      capacity: 2
    },
    trigger: false,
    audio: {
      type: 'repeat',
      fire: './fx/audio/shotgun/shotgun-fire.mp3',
      reload: './fx/audio/shotgun/shotgun-reload.mp3'
    }
  },
  {
    name: 'Machine Gun',
    type: 'gun',
    projectile: {
      color: ['#CC5500', '#F8CA00'],
      spread: {
        min: 0,
        max: 0,
      },
      dps: 15,
      dropoff: 40,
    },
    clip: {
      current: 225,
      capacity: 225
    },
    magazines: {
      current: 2,
      capacity: 2
    },
    trigger: true,
    audio: {
      type: 'repeat',
      fire: './fx/audio/machine-gun/machine-gun-fire.mp3',
      reload: './fx/audio/machine-gun/machine-gun-reload.mp3'
    }
  },
  {
    name: 'Flamethrower',
    type: 'gun',
    projectile: {
      color: ['#CC5500', '#F8CA00'],
      spread: {
        min: -5,
        max: 5,
      },
      dps: 10,
      dropoff: 20,
    },
    clip: {
      current: 600,
      capacity: 600
    },
    magazines: {
      current: 2,
      capacity: 2
    },
    trigger: true,
    audio: {
      type: 'repeat',
      fire: './fx/audio/flamethrower/flamethrower-fire.mp3',
      reload: './fx/audio/flamethrower/flamethrower-reload.mp3'
    }
  }
];