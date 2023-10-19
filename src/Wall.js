export class Wall
{
  constructor (x, y) {
    this.bounding = 'box';
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

  render (context) {
    if (this.sleep) {
      return;
    }

    context.beginPath();
    context.rect(this.x, this.y, 150, 150);
    context.fillStyle = '#8fce00';
    context.fill();
  };
};