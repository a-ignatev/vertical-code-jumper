import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Sound } from "engine/sound/Sound";
import { BonusIndicator } from "./BonusIndicator";

const DRINKING_SPEED = window.innerHeight / 10; // 10 seconds
const POURING_SPEED = window.innerHeight; // 1 second
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

  constructor() {
    super();

    this.baseHeight = window.innerHeight;
    this.shift = 0;
    this.sound = new Sound("pouring-drink.mp3");
    this.sound.setCurrentTime(0.2);
    this.sound.play();
  }

  getBoundingRect(): Rect {
    throw new Error("Method not implemented.");
  }

  update({ delta }: Context): void {
    if (this.isPouring) {
      this.baseHeight -= POURING_SPEED * delta;
    } else {
      this.baseHeight += DRINKING_SPEED * delta;
    }

    this.shift -= SHIFT_SPEED * delta;

    if (this.isMiddleGoingUp === true) {
      this.middleHeight -= 0.1;
    } else {
      this.middleHeight += 0.1;
    }

    if (this.middleHeight > 10) {
      this.isMiddleGoingUp = true;
    }

    if (this.middleHeight < -10) {
      this.isMiddleGoingUp = false;
    }

    if (this.isPouring && this.baseHeight <= 0) {
      this.isPouring = false;
    } else if (this.baseHeight >= window.innerHeight + SCALE) {
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
    ctx.moveTo(window.innerWidth, window.innerHeight);
    ctx.lineTo(0, window.innerHeight);
    ctx.lineTo(0, this.baseHeight + height);

    let x = 0;
    while (x <= window.innerWidth) {
      const y =
        Math.sin(x * SCALE + phase + this.shift) * SCALE +
        this.baseHeight +
        height;
      ctx.lineTo(x, y);
      x += SEGMENT_LENGTH;
    }

    ctx.lineTo(window.innerWidth, this.baseHeight + height);
    ctx.closePath();
    ctx.fill();
  }

  getZOrder(): number {
    return -100;
  }
}
