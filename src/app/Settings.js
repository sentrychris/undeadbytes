const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = class Settings 
{
  constructor (context) {
    this.dir = '.undeadbytesgame';
    this.path = path.normalize(os.homedir() + '/' + this.dir + '/');
    this.file = this.path + 'settings.json';

    this.context = context;

    this.settings = {
      volumes: {
        weapon: 0.5,
        snippets: 0.5,
        soundtrack: 0.5
      }
    }

    this.initSettingsFile();
  }

  initSettingsFile (settings = {}) {
    if (! fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }

    if (! fs.existsSync(this.file)) {
      settings = {
        ...this.settings,
        ...settings
      };

      this.saveSettingsToFile(settings);
    }
  }

  loadSettingsFile () {
    const file = fs.readFileSync(this.file, {
      encoding: 'utf-8'
    });

    return JSON.parse(file);
  }

  saveSettingsToFile (settings) {
    try {
      fs.writeFileSync(this.file, JSON.stringify(settings, null, 4), {
        encoding: 'utf-8'
      });
    } catch (err) {
      console.log(err);
    }
  }
}