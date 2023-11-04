const os = require('os');
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

/**
 * App storage.
 * @class
 * @category Desktop App
 */
class AppStorage 
{
  /**
   * Create a new app storage instance.
   * 
   * @constructor
   * @param {BrowserWindow} context - the electron browser window
   */
  constructor (context) {
    /**
     * path - the path to the game directory e.g. %USER%/.undeadbytesgame/
     * @type {string}
     */
    this.path = path.normalize(os.homedir() + '/.undeadbytesgame/');

    if (! fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }

    /**
     * context - the electron browser window
     * @type {BrowserWindow}
     */
    this.context = context;

    /**
     * settingsFile - the full path to the settings file
     * @type {string}
     */
    this.settingsFile = this.path + 'settings.json';

    /**
     * settings - the default game settings
     * @type {object}
     */
    this.settings = {
      volumes: {
        fx: {
          weapon: 0.5,
          snippet: 0.5,
        },
        soundtrack: 0.5
      }
    }

    /**
     * savedGamesDir - the full path to the saved games directory
     * @type {string}
     */
    this.savedGamesDir = path.normalize(this.path + 'saved_games/');

    /**
     * savedGames - array to contain saved games
     * @type {array}
     */
    this.savedGames = [];
    
    if (! fs.existsSync(this.savedGamesDir)) {
      fs.mkdirSync(this.savedGamesDir);
    }

    this.createSettingsIfNotExists();
    this.loadSavedGamesFromDir();
  }

  /**
   * Create the default game settings file if it does not exist.
   * @memberof storage
   * @param {Objet} settings - game settings
   * 
   * @returns {void}
   */
  createSettingsIfNotExists (settings = {}) {
    if (! fs.existsSync(this.settingsFile)) {
      settings = {
        ...this.settings,
        ...settings
      };

      this.saveSettingsToFile(settings);
    }
  }

  /**
   * Load game settings from file.
   * 
   * @returns {Object}
   */
  loadSettingsFromFile () {
    const settings = JSON.parse(fs.readFileSync(this.settingsFile, {
      encoding: 'utf-8'
    }));

    if (settings) {
      this.settings = settings;
    }

    return this.settings;
  }

  /**
   * Save game settings to file.
   * 
   * @param {Object} settings 
   * 
   * @returns {void}
   */
  saveSettingsToFile (settings) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 4), {
        encoding: 'utf-8'
      });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Load saved games from the saved games diretory.
   * 
   * @returns {void};
   */
  loadSavedGamesFromDir () {
    try {
      fs.readdirSync(this.savedGamesDir).forEach((file) => {
        this.savedGames.push(file);
      });
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Load a saved game object from a save file.
   * 
   * @returns {Promise}
   */
  async loadGameFromFile () {
    return new Promise((resolve) => {
      dialog.showOpenDialog({
        defaultPath: this.savedGamesDir,
        filters: [
          { name: 'Undead Bytes Saves', extensions: ['json'] }
        ],
        properties: ['openFile']
      }).then(({ filePaths }) => {
        if (filePaths.length === 0) {
          throw new Error('noselection');
        }

        const game = JSON.parse(fs.readFileSync(filePaths[0], {
          encoding: 'utf-8'
        }));
  

        return resolve(game);
      }).catch((err) => {
        console.log(err);
      })
    })
  }

  /**
   * Save a game object to a new save file.
   * 
   * @param {Object} save - the save game object
   * 
   * @returns {void}
   */
  saveGameToFile (save) {    
    try {
      const date = (new Date()).toISOString()
        .slice(0, 19)
        .replace('T', '');

      const file = `undeadbytes-save-level-${save.level}-${date.replace(/[:-]/g, '')}.json`;
      const path = this.savedGamesDir + file;

      fs.writeFileSync(path, JSON.stringify(save, null, 4), {
        encoding: 'utf-8',
        flag: 'a+'
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AppStorage;