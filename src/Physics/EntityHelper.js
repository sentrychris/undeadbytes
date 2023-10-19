import { EntityDrawer } from './EntityDrawer';

export class _EntityHelper
{
  intersection (r1, r2) {
    return ! (r1.x + r1.width < r2.x
      || r1.y + r1.height < r2.y
      || r1.x > r2.x + r2.width
      || r1.y > r2.y + r2.height
    );
  }

  beginRotationOffset(context, x, y, angle) {
    context.translate(-(-x + context.canvas.width / 2), -(-y + context.canvas.height / 2));
    context.translate(context.canvas.width / 2, context.canvas.height / 2);

    context.rotate(angle);
  }

  endRotationOffset(context, x, y, angle) {
    context.rotate(-angle);

    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
    context.translate(+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));
  }

  render (context, entity) {
    this.beginRotationOffset(context, entity.x, entity.y, entity.angle);

    if (! entity.dead) {
      entity.type === 'enemy'
        ? EntityDrawer.enemy(context, entity.position)
        : EntityDrawer.player(context, entity.position);
    } else {
      entity.type === 'enemy'
        ? EntityDrawer.deadEnemy(context)
        : EntityDrawer.deadPlayer(context);
    }
    
    this.endRotationOffset(context, entity.x, entity.y, entity.angle);
    EntityDrawer.healthBar(context, entity.health, entity.x, entity.y);
  }
}

export const EntityHelper = new _EntityHelper();
