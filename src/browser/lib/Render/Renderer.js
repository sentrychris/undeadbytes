import { PlayerRender } from './PlayerRender';
import { EnemyRender } from './EnemyRender';
import { config } from '../../config';

/**
 * Entity Renderer
 * @class
 * @category Game
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
   * @param {Object} entity - the entity to render
   * 
   * @returns {void}
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
          ? EnemyRender.alive(context, entity.position, entity.color)
          : PlayerRender.alive(context, entity.position);
      } else {
        entity.type === 'enemy'
          ? EnemyRender.dead(context, entity.color)
          : PlayerRender.dead(context);
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
   * 
   * @returns {void}
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
   * 
   * @returns {void}
   */
  static endRotationOffset (context, x, y, angle) {
    context.rotate(-angle);
  
    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    context.translate(+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));
  }

  /**
   * Draw entity health bar.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} x - the entity x-coordinate
   * @param {number} y - the entity y-coordinate
   * @param {number} health - the entity's health value
   * 
   * @returns {void}
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
