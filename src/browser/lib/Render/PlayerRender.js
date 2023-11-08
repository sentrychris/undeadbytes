import { config } from '../../config';
import { randomNumber } from '../../util';
import { WeaponRender } from './WeaponRender';

export class PlayerRender
{
  /**
   * Draw the player entity.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @param {number} position - the entity's position for feet animation
   * 
   * @returns {void}
   */
  static alive (context, position, isFiringWeapon) {
    const { model } = config.player;
    context.shadowBlur = model.glow;
    context.shadowColor = model.shadow;

    // left foot
    context.beginPath();
    context.rect(20, -20 + (position * 35), 25, 40);
    context.fillStyle = model.feet;
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-40, -20 + (position * -35), 25, 40);
    context.fillStyle = model.feet;
    context.fill();

    // left hand
    context.rotate(30 * Math.PI / 180);
    context.beginPath();
    context.rect(40, -10, 20, 80);
    context.fillStyle = model.hands.left;
    context.fill();
    context.rotate(-30 * Math.PI / 180);

    // right hand
    context.rotate(-50 * Math.PI / 180);
    context.beginPath();
    context.rect(-55, -20, 20, 45);
    context.fillStyle = model.hands.right;
    context.fill();
    context.rotate(50 * Math.PI / 180);

    // left torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = model.torso.left;
    context.fill();

    // backpack
    context.beginPath();
    context.rect(-27, -47, 50, 50);
    context.fillStyle = model.backpack;
    context.fill();
    
    // right torso
    context.beginPath();
    context.rect(-60, - 30, 80, 60);
    context.fillStyle = model.torso.right;
    context.fill();

    // Weapon
    WeaponRender.gun(
      context,
      model,
      isFiringWeapon ? randomNumber(30, 60) : 20
    );

    // head
    context.beginPath();
    context.arc(0, 0, 40, 0, 2 * Math.PI);
    context.fillStyle = model.head;
    context.fill();
    
    // hair
    context.beginPath();
    context.arc(0, 0, 22, 0, 2 * Math.PI);
    context.fillStyle = model.hair;
    context.fill();
    
    // left sunglasses
    context.beginPath();
    context.rect(6, 31, 18, 7);
    context.fillStyle = model.sunglasses;
    context.fill();
    // sunglasses frame
    context.beginPath();
    context.rect(-8, 32, 15, 3);
    context.fillStyle = model.sunglasses;
    context.fill();
    // right sunglasses
    context.beginPath();
    context.rect(-24, 31, 18, 7);
    context.fillStyle = model.sunglasses;
    context.fill();

    // helmet
    context.rotate(-180 * Math.PI / 180);
    context.beginPath();
    context.arc(0, -4, 44, 6, 180 * Math.PI / 180);
    context.fillStyle = model.helmet;
    context.fill();
    context.rotate(180 * Math.PI / 180);
  }

  /**
   * Draw dead player.
   * 
   * @param {CanvasRenderingContext2D} context  - the canvas context for rendering
   * @returns {void}
   */
  static dead (context) {
    const { model } = config.player;

    // left foot
    context.beginPath();
    context.rect(30, 20, 25, 40);
    context.fillStyle = model.feet;
    context.fill();

    // right foot
    context.beginPath();
    context.rect(-25, -30 -35, 25, 40);
    context.fillStyle = model.feet;
    context.fill();

    // left hand
    context.rotate(25 * Math.PI / 180);
    context.beginPath();
    context.rect(40, -5, 20, 80);
    context.fillStyle = model.hands.left;
    context.fill();
    context.rotate(-25 * Math.PI / 180);

    // right hand
    context.rotate(-60 * Math.PI / 180);
    context.beginPath();
    context.rect(-40, 20, 20, 45);
    context.fillStyle = model.hands.right;
    context.fill();
    context.rotate(60 * Math.PI / 180);

    // torso
    context.beginPath();
    context.rect(-60, - 30, 120, 60);
    context.fillStyle = '#53777A';
    context.fill();

    // head
    context.beginPath();
    context.arc(20, 10, 35, 0, 2 * Math.PI);
    context.fillStyle = '#F1D4AF';
    context.fill();

    // hair
    context.rotate(-170 * Math.PI / 180);
    context.beginPath();
    context.arc(0, 0, 44, 0, 180 * Math.PI / 180);
    context.fillStyle = '#4d2600';
    context.fill();
    context.rotate(170 * Math.PI / 180);
  }
}