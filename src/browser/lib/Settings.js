export class Settings
{
  constructor (bridge = 'web') {
    this.key = 'undeadbytes-game-';
    this.settings = null;

    if (bridge === 'web') {
      this.configureLocalStorageSettings();
    } else {
      this.configureFileSettings();
    }
  }

  configureLocalStorageSettings() {
    this.settings = JSON.parse(localStorage.getItem(this.key));
  }

  configureFileSettings () {
    //
  }
}