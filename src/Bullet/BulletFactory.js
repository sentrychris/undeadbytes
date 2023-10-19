import { Bullet } from './Bullet';
import { mappings } from './mappings';

export class BulletFactory {
  constructor() {
    this.automatic = true;
    this.frames = 0;
    this.bullets = [];
    this.indexesToDelete = [];
  }

  update (context, player, walls, mouse, weaponIndex = 0) {
    const weapon = mappings[weaponIndex];

    if (weapon && this.automatic && !player.dead) {
      if (mouse.pressed) {       
        for (let i = weapon.min; i <= weapon.max; i++) {
          const bullet = new Bullet(context, player, i);
          this.bullets.push(bullet);
        }

        this.automatic = weapon.automatic;
      }
    } else {
      this.frames++;
      if (this.frames >= 60) {
        this.frames = 0;
        this.automatic = true;
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