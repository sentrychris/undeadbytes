import { Bullet } from './Bullet';

export class BulletFactory {
  constructor() {
    this.canSpawn = true;
    this.frames = 0;
    this.bullets = [];
    this.indexesToDelete = [];
  }

  update (context, player, walls, mouse) {
    if (this.canSpawn && !player.dead) {
      if (mouse.pressed) {
        for (let i = -3; i <= 3; i++) {
          const bullet = new Bullet(context, player, i);
          this.bullets.push(bullet);
        }

        this.canSpawn = false;
      }
    } else {
      this.frames++;
      if (this.frames >= 60) {
        this.frames = 0;
        this.canSpawn = true;
      }
    }

    this.indexesToDelete = [];
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update(walls);
      if (this.bullets[i].markToDelete) {
        this.indexesToDelete.push(i);
      }
    }

    for (let i = 0; i < this.indexesToDelete.length; i++) {
      this.bullets.splice(this.indexesToDelete[i], 1);
    }
  }

  render () {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].render();
    }
  }
}