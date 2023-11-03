import { config } from '../config';

/**
 * Entity Renderer
 */
export class Renderer
{
  /**
   * Render the entity on the canvas.
   * 
   * This method is called on every frame/repaint. It checks to see if the entity render state
   * is active, and checks the entity type to apply specified behaviour and styles.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas context for rendering.
   * @param {*} entity - the entity to render
   */
  static render (entity, context) {
    if (entity.sleep) {
      return;
    }

    if (entity.type === 'pickup') {
      context.shadowBlur = entity.glow;
      context.shadowColor = entity.color;

      const size = config.cell.size / 2;

      if (entity.image.complete) {
        context.drawImage(entity.image, entity.x, entity.y, size, size);
      } else {
        entity.image.onload = () => context.drawImage(entity.image, entity.x, entity.y, size, size);
      }
    } else {
      Renderer.beginRotationOffset(context, entity.x, entity.y, entity.angle);

      if (! entity.dead) {
        entity.type === 'enemy'
          ? Renderer.enemy(context, entity.position)
          : Renderer.player(context, entity.position);
      } else {
        entity.type === 'enemy'
          ? Renderer.deadEnemy(context)
          : Renderer.deadPlayer(context);
      }
      
      Renderer.endRotationOffset(context, entity.x, entity.y, entity.angle);
      Renderer.health(context, entity.x, entity.y, entity.health);
    }
  }

  /**
   * Calculate offset and begin rotating entity to given angle at position.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas context for rendering
   * @param {number} x - the entity x-coordinate
   * @param {number} y - the entity y-coordinate
   * @param {number} angle the angle to rotate on the canvas
   */
  static beginRotationOffset (context, x, y, angle) {
    context.translate(-(-x + context.canvas.width / 2), -(-y + context.canvas.height / 2));
    context.translate(context.canvas.width / 2, context.canvas.height / 2);
  
    context.rotate(angle);
  }
  
  /**
   * Stop rotating entity to given angle at position.
   * 
   * @param {CanvasRenderingContext2D} context - the canvas context for rendering
   * @param {number} x - the entity x-coordinate
   * @param {number} y - the entity y-coordinate
   * @param {number} angle the angle to rotate on the canvas
   */
  static endRotationOffset (context, x, y, angle) {
    context.rotate(-angle);
  
    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    context.translate(+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));
  }

  /**
   * Draw the player entity.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} position - the entity's position for feet animation
   */
  static player (context, position) {
    context.shadowBlur = 5;
    context.shadowColor = 'white';

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
    context.arc(0, 0, 50, 0, 180 * Math.PI / 180);
    context.fillStyle = '#454B1B';
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead player.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   */
  static deadPlayer (context) {
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
   * Draw enemy.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} position - the entity's position for feet animation
   */
  static enemy (context, position) {
    context.shadowBlur = 10;
    context.shadowColor = '#8fce00';
    
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
    context.fillStyle = '#880808';
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead enemy.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   */
  static deadEnemy (context) {
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
   * Draw entity health bar.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} x - the entity x-coordinate
   * @param {number} y - the entity y-coordinate
   * @param {number} health - the entity's health value
   */
  static health (context, x, y, health) {
    context.beginPath();
    context.rect(x - 50, y + 60, 100, 5);
    context.strokeStyle = 'black';
    context.stroke();

    let color; 
    if (health <= 35) {
      color = 'red';
    } else if (health <= 75) {
      color = 'orange';
    } else {
      color = '#50ffb0';
    }

    context.beginPath();
    context.rect(x - 50, y + 60, health, 5);
    context.fillStyle = color;
    context.fill();
  }
}
