export class WeaponRender
{
  /**
   * Render gun.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas rendering context.
   * @param {*} model - the weapon model
   * @param {number} boltPosition - the position of the bolt
   */
  static gun (context, model, boltPosition) {
    // gun
    context.beginPath();
    context.rect(-12.5, 30, 25, 70);
    context.fillStyle = model.weapon;
    context.fill();

    // barrel
    context.rotate(41 * Math.PI / 180);
    context.beginPath();
    context.rect(54, 42, 2, 15);
    context.fillStyle = '#777777';
    context.fill();
    context.rotate(-41 * Math.PI / 180);
    context.rotate(40 * Math.PI / 180);
    context.beginPath();
    context.rect(46, 36, 2, 15);
    context.fillStyle = '#777777';
    context.fill();
    context.rotate(-40 * Math.PI / 180);
    context.rotate(38 * Math.PI / 180);
    context.beginPath();
    context.rect(37, 29, 2, 15);
    context.fillStyle = '#777777';
    context.fill();
    context.rotate(-38 * Math.PI / 180);

    // receiver
    context.beginPath();
    context.rect(-10.5, 5, 5, 70);
    context.fillStyle = '#777777';
    context.fill();

    // bolt
    context.beginPath();
    context.rect(-10.5, 5, 5, boltPosition);
    context.fillStyle = '#333333';
    context.fill();

    // muzzle
    context.beginPath();
    context.rect(-7.5, 100, 15, 7.5);
    context.fillStyle = '#777777';
    context.fill();
  }
}