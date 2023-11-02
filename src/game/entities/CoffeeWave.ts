import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Sound } from "engine/sound/Sound";
import { BonusIndicator } from "./BonusIndicator";

const MIDDLE_WAVE_SPEED = 6.25;
const MIDDLE_WAVE_MAX = 10;
const MIDDLE_WAVE_MIN = -10;
const SHIFT_SPEED = 4;
const SEGMENT_LENGTH = 20;
const SCALE = 5;

export class CoffeeWave extends Entity {
  private baseHeight: number;
  private shift: number;
  private isMiddleGoingUp: boolean = true;
  private middleHeight: number = 0;
  private isPouring = true;
  private sound: Sound;
  private drinkingSpeed: number;
  private pouringSpeed: number;

  constructor(ctx: CanvasRenderingContext2D) {
    super();

    this.baseHeight = ctx.canvas.height;
    this.drinkingSpeed = ctx.canvas.height / 10; // 10 seconds
    this.pouringSpeed = ctx.canvas.height; // 1 second
    this.shift = 0;
    this.sound = new Sound("pouring-drink.mp3");
    this.sound.setCurrentTime(0.2);
    this.sound.play();
  }

  getBoundingRect(): Rect {
    throw new Error("Method not implemented.");
  }

  update({ delta, ctx }: Context): void {
    if (this.isPouring) {
      this.baseHeight -= this.pouringSpeed * delta;
    } else {
      this.baseHeight += this.drinkingSpeed * delta;
    }

    this.shift -= SHIFT_SPEED * delta;

    if (this.isMiddleGoingUp === true) {
      this.middleHeight -= MIDDLE_WAVE_SPEED * delta;
    } else {
      this.middleHeight += MIDDLE_WAVE_SPEED * delta;
    }

    if (this.middleHeight > MIDDLE_WAVE_MAX) {
      this.isMiddleGoingUp = true;
    }

    if (this.middleHeight < MIDDLE_WAVE_MIN) {
      this.isMiddleGoingUp = false;
    }

    if (this.isPouring && this.baseHeight <= 0) {
      this.isPouring = false;
    } else if (this.baseHeight >= ctx.canvas.height + SCALE) {
      this.getScene().removeEntity(this);
      this.getScene()
        .getEntity<BonusIndicator>("bonusIndicator")
        ?.setIsHidden(true);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "#ece0d1";
    this.renderSineWave(ctx, 40, -SCALE, "rgb(236, 224, 209)");
    this.renderSineWave(ctx, 10, this.middleHeight, "rgb(219, 193, 172)");
    this.renderSineWave(ctx, 0, 2 * SCALE, "rgb(99, 72, 50)");
  }

  private renderSineWave(
    ctx: CanvasRenderingContext2D,
    phase: number,
    height: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width, ctx.canvas.height);
    ctx.lineTo(0, ctx.canvas.height);
    ctx.lineTo(0, this.baseHeight + height);

    let x = 0;
    while (x <= ctx.canvas.width) {
      const y =
        Math.sin(x * SCALE + phase + this.shift) * SCALE +
        this.baseHeight +
        height;
      ctx.lineTo(x, y);
      x += SEGMENT_LENGTH;
    }

    ctx.lineTo(ctx.canvas.width, this.baseHeight + height);
    ctx.closePath();
    ctx.fill();
  }

  getZOrder(): number {
    return -100;
  }
}
