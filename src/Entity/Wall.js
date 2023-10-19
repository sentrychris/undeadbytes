export class Wall
{
  constructor (x, y) {
    this.boundingType = 'box';
    this.x = x * 150;
    this.y = y * 150;
    this.sleep = true;

    this.bounds = {
      x: this.x,
      y: this.y,
      width: 150,
      height: 150
    };
  }

  update (player, enemies) {};

  render (context) {
    if (this.sleep) {
      return;
    }

    context.beginPath();
    context.rect(this.x, this.y, 150, 150);
    context.fillStyle = '#774F38';
    context.fill();
  };
};