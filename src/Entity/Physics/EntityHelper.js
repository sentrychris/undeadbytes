export class _EntityHelper
{
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
}

export const EntityHelper = new _EntityHelper();
