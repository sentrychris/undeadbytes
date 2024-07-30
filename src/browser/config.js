import { APP_VERSION } from '../shared/version.js';

/**
 * Game configuration and defaults.
 * 
 * @category Game
 * @memberof Game
 * @module configuration
 */
export const config = {
  version: APP_VERSION,
  cell: {
    radius: 60,
    size: 150,
  },
  game: {
    savesLocalStorageKey: 'undeadbytes-saves'
  },
  player: {
    health: 100,
    speed: 5,
    model: {
      glow: 8,
      feet: '#454B1B',
      hands: {
        left: '#7C815F',
        right: '#53777A'
      },
      torso: {
        left: '#53777A',
        right: '#7C815F'
      },
      head: '#F1D4AF',
      hair: 'rgba(58,35,0,0.5)',
      helmet: '#454B1B',
      sunglasses: '#222222',
      backpack: '#777777',
      weapon: '#999999',
      shadow: '#6E8C8F',
    }
  },
  pickups: {
    size: 75,    // Default render size (config.cell.size / 2)
    ammo: false, // Ammo pickup values are handled by ballistics on a per-weapon basis
    health: 25,  // Health is depleted in increments of 25, so regain a depleted "unit"
    stamina: 7.5 // Speed is set to 5, use 7.5 when stamina is picked up
  },
  device: {
    keyboard: {
      up: false,
      down: false,
      left: false,
      right: false
    },
    mouse: {
      x: 0,
      y: 0,
      pressed: false
    }
  },
  volumes: {
    fx: {
      weapon: 0.5,
      snippet: 0.5,
    },
    soundtrack: 0.5
  },
};