import { EntityDrawer } from './EntityDrawer';

export class _EntityHelper
{
  /**
   * Determine intersection between entities
   * 
   * @param {*} r1 
   * @param {*} r2 
   * @returns 
   */
  intersection (r1, r2) {
    return ! (r1.x + r1.width < r2.x
      || r1.y + r1.height < r2.y
      || r1.x > r2.x + r2.width
      || r1.y > r2.y + r2.height
    );
  }

  /**
   * Begin rotating entity to given angle at position
   * 
   * @param {*} context 
   * @param {*} x 
   * @param {*} y 
   * @param {*} angle 
   */
  beginRotationOffset(context, x, y, angle) {
    context.translate (-(-x + context.canvas.width / 2), -(-y + context.canvas.height / 2));
    context.translate (context.canvas.width / 2, context.canvas.height / 2);

    context.rotate (angle);
  }

  /**
   * Stop rotating entity to given angle at position
   * 
   * @param {*} context 
   * @param {*} x 
   * @param {*} y 
   * @param {*} angle 
   */
  endRotationOffset(context, x, y, angle) {
    context.rotate (-angle);

    context.translate (-context.canvas.width / 2, -context.canvas.height / 2);
    context.translate (+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));
  }

  /**
   * Render the entity
   * 
   * @param {*} context 
   * @param {*} entity 
   */
  render (context, entity) {
    this.beginRotationOffset (context, entity.x, entity.y, entity.angle);

    if (! entity.dead) {
      entity.type === 'enemy'
        ? EntityDrawer.enemy (context, entity.position)
        : EntityDrawer.player (context, entity.position);
    } else {
      entity.type === 'enemy'
        ? EntityDrawer.deadEnemy (context)
        : EntityDrawer.deadPlayer (context);
    }
    
    this.endRotationOffset (context, entity.x, entity.y, entity.angle);
    EntityDrawer.health (context, entity.health, entity.x, entity.y);
  }
}

export const EntityHelper = new _EntityHelper ();
