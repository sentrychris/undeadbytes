const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = class Storage 
{
  constructor (context) {
    this.path = path.normalize(os.homedir() + '/.undeadbytesgame/');

    if (! fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }

    this.context = context;

    this.settingsFile = this.path + 'settings.json';
    this.settings = {
      volumes: {
        fx: {
          weapon: 0.5,
          snippet: 0.5,
        },
        soundtrack: 0.5
      }
    }

    this.savedGamesDir = path.normalize(this.path + 'saved_games/');
    this.savedGames = [];
    
    if (! fs.existsSync(this.savedGamesDir)) {
      fs.mkdirSync(this.savedGamesDir);
    }

    this.createSettingsIfNotExists();
    this.loadSavedGamesFromDir();
  }

  createSettingsIfNotExists (settings = {}) {
    if (! fs.existsSync(this.settingsFile)) {
      settings = {
        ...this.settings,
        ...settings
      };

      this.saveSettingsToFile(settings);
    }
  }

  loadSettingsFromFile () {
    const settings = JSON.parse(fs.readFileSync(this.settingsFile, {
      encoding: 'utf-8'
    }));

    if (settings) {
      this.settings = settings;
    }

    return this.settings;
  }

  saveSettingsToFile (settings) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 4), {
        encoding: 'utf-8'
      });
    } catch (err) {
      console.log(err);
    }
  }

  loadSavedGamesFromDir () {
    try {
      fs.readdirSync(this.savedGamesDir).forEach((file) => {
        this.savedGames.push(file);
      });
      console.log(this.savedGames);
    } catch (err) {
      console.log(err)
    }
  }

  saveGameToFile (save) {    
    try {
      console.log('Saving game - ', save);

      const date = (new Date()).toISOString()
        .slice(0, 19)
        .replace('T', '');

      const file = `undeadbytes-save-${date.replace(/[:-]/g, '')}.json`;
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