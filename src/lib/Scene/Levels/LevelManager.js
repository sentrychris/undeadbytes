import { mappings } from './mappings';

export class _LevelManager
{
  constructor () {
    this.levelIndex = 0;
    this.lastLevel = null;
    this.nextLevel = null;
    this.levels = mappings;
  }

  setLevelIndex (index = 0) {
    this.levelIndex = index;
  }

  /**
   * Set last level, called after the level index has changed.
   */
  setLastLevel () {
    this.lastLevel = mappings[this.levelIndex - 1];
  }

  setNextLevel () {
    this.nextLevel = mappings[this.levelIndex + 1];
  }
}

export const LevelManager = new _LevelManager();