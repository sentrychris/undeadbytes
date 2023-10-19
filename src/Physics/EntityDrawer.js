export class _EntityDrawer
{
  /**
   * Draw player
   * 
   * @param {*} context 
   * @param {*} position 
   */
  player (context, position) {
    // left foot
    context.beginPath();
    context.rect(20, -20 + (position * 35), 25, 40);
    context.fillStyle = '#D95B43';
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-40, -20 + (position * -35), 25, 40);
    context.fillStyle = '#D95B43';
    context.fill();

    // left hand
    context.rotate(30 * Math.PI / 180);
    context.beginPath();
    context.rect(40, -10, 20, 80);
    context.fillStyle = '#C02942';
    context.fill();
    context.rotate(-30 * Math.PI / 180);

    // right hand
    context.rotate(-50 * Math.PI / 180);
    context.beginPath();
    context.rect(-55, -20, 20, 45);
    context.fillStyle = '#C02942';
    context.fill();
    context.rotate(50 * Math.PI / 180);

    // torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = '#53777A';
    context.fill();

    // gun
    context.beginPath();
    context.rect(-12.5, 30, 25, 70);
    context.fillStyle = 'gray';
    context.fill();

    // head
    context.beginPath();
    context.arc(0, 0, 40, 0, 2 * Math.PI);
    context.fillStyle = '#F1D4AF';
    context.fill();

    // hair
    context.rotate(-180 * Math.PI / 180);
    context.beginPath();
    context.arc(0, 0, 37, 0, 180 * Math.PI / 180);
    context.fillStyle = '#4d2600';
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead player
   * 
   * @param {*} context 
   */
  deadPlayer (context) {
    // left foot
    context.beginPath();
    context.rect(30, 20, 25, 40);
    context.fillStyle = '#D95B43';
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-25, -30 -35, 25, 40);
    context.fillStyle = '#D95B43';
    context.fill();

    // left hand
    context.rotate(25 * Math.PI / 180);
    context.beginPath();
    context.rect(40, -5, 20, 80);
    context.fillStyle = '#C02942';
    context.fill();
    context.rotate(-25 * Math.PI / 180);

    // right hand
    context.rotate(-60 * Math.PI / 180);
    context.beginPath();
    context.rect(-40, 20, 20, 45);
    context.fillStyle = '#C02942';
    context.fill();
    context.rotate(60 * Math.PI / 180);

    // torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = '#53777A';
    context.fill();

    // gun
    // context.beginPath();
    // context.rect(-12.5, 40, 25, 70);
    // context.fillStyle = 'gray';
    // context.fill();

    // head
    context.beginPath();
    context.arc(20, 10, 35, 0, 2 * Math.PI);
    context.fillStyle = '#F1D4AF';
    context.fill();

    // hair
    context.rotate(-170 * Math.PI / 180);
    context.beginPath();
    context.arc(0, 0, 32, 0, 180 * Math.PI / 180);
    context.fillStyle = '#4d2600';
    context.fill();
    context.rotate(170 * Math.PI / 180);
  }

  /**
   * Draw enemy
   * 
   * @param {*} context 
   * @param {*} position 
   */
  enemy (context, position) {
    // left foot
    context.beginPath();
    context.rect(20, -20 + (position * 35), 25, 40);
    context.fillStyle = '#79BD9A';
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-40, -20 + (position * -35), 25, 40);
    context.fillStyle = '#79BD9A';
    context.fill();

    // left hand
    context.beginPath();
    context.rect(-50, -10, 20, 90);
    context.fillStyle = '#3B8686';
    context.fill();

    // right hand
    context.beginPath();
    context.rect(30, -10, 20, 85);
    context.fillStyle = '#3B8686';
    context.fill();

    // torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = '#0B486B';
    context.fill();

    // head
    context.beginPath();
    context.arc(0, 0, 40, 0, 2 * Math.PI);
    context.fillStyle = '#CFF09E';
    context.fill();

    // hair
    context.rotate(-180 * Math.PI / 180);
    context.beginPath();
    context.arc(0, 0, 37, 0, 180 * Math.PI / 180);
    context.fillStyle = '#4d2600';
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead enemy
   * 
   * @param {*} context 
   */
  deadEnemy (context) {
    // left foot
    context.beginPath();
    context.rect(52, -30, 25, 40);
    context.fillStyle = '#79BD9A';
    context.fill();

    // right foot
    context.beginPath();
    context.rect(26, -40, 25, 40);
    context.fillStyle = '#79BD9A';
    context.fill();

    // left hand
    context.beginPath();
    context.rect(-25, 35, 20, 90);
    context.fillStyle = '#3B8686';
    context.fill();

    // right hand
    context.beginPath();
    context.rect(35, -40, 20, 85);
    context.fillStyle = '#3B8686';
    context.fill();

    // torso
    context.beginPath();
    context.rect(-42, -20, 120, 60);
    context.fillStyle = '#0B486B';
    context.fill();

    // head
    context.beginPath();
    context.arc(10, 5, 35, 0, 2 * Math.PI);
    context.fillStyle = '#CFF09E';
    context.fill();

    // hair
    context.rotate(-170 * Math.PI / 180);
    context.beginPath();
    context.arc(0, 0, 25, 0, 180 * Math.PI / 180);
    context.fillStyle = '#4d2600';
    context.fill();
    context.rotate(170 * Math.PI / 180);
  }

  /**
   * Draw health
   * 
   * @param {*} context 
   * @param {*} health 
   * @param {*} centerX 
   * @param {*} centerY 
   */
  health(context, health, centerX, centerY) {
    context.beginPath();
    context.rect(centerX - 50, centerY + 60, 100, 5);
    context.strokeStyle = 'black';
    context.stroke();

    let color; 
    if (health <= 35) {
      color = 'red';
    } else if (health <= 75) {
      color = 'orange';
    } else {
      color = 'lime';
    }

    context.beginPath();
    context.rect(centerX - 50, centerY + 60, health, 5);
    context.fillStyle = color;
    context.fill();
  }
}

export const EntityDrawer = new _EntityDrawer();
