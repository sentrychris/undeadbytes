export class EnemyRender
{
  /**
   * Draw enemy.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} position - the entity's position for feet animation
   * @param {Object} color  - the colors for the components
   * 
   * @returns {void}
   */
  static alive (context, position, color) {
    context.shadowBlur = 10;
    context.shadowColor = '#8fce00';
    
    // left foot
    context.beginPath();
    context.rect(20, -20 + (position * 35), 25, 40);
    context.fillStyle = color.feet;
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-40, -20 + (position * -35), 25, 40);
    context.fillStyle = color.feet;
    context.fill();

    // left hand
    context.beginPath();
    context.rect(-50, -10, 20, 90);
    context.fillStyle = color.hands;
    context.fill();

    // right hand
    context.beginPath();
    context.rect(30, -10, 20, 85);
    context.fillStyle = color.hands;
    context.fill();

    // torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = color.torso;
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
    context.fillStyle = '#880808';
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead enemy.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {Object} color  - the colors for the components
   * 
   * @returns {void}
   */
  static dead (context, color) {
    // left foot
    context.beginPath();
    context.rect(52, -30, 25, 40);
    context.fillStyle = color.feet;
    context.fill();

    // right foot
    context.beginPath();
    context.rect(26, -40, 25, 40);
    context.fillStyle = color.feet;
    context.fill();

    // left hand
    context.beginPath();
    context.rect(-25, 35, 20, 90);
    context.fillStyle = color.hands;
    context.fill();

    // right hand
    context.beginPath();
    context.rect(35, -40, 20, 85);
    context.fillStyle = color.hands;
    context.fill();

    // torso
    context.beginPath();
    context.rect(-42, -20, 120, 60);
    context.fillStyle = color.torso;
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
}