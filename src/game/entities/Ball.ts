import { Context, Entity } from "./Entity";
import { Rect } from "./Rect";

const BALL_RADIUS = 20;
const GRAVITY = 60;
const JUMP_SPEED = -130;
const BALL_COLOR = "#2ed851";
export const SIDE_SPEED = 60;

export class Ball implements Entity {
  speedX: number;
  speedY: number;
  private cx: number;
  private cy: number;

  constructor(cx: number, cy: number) {
    this.speedX = 0;
    this.speedY = GRAVITY;
    this.cx = cx;
    this.cy = cy;
  }

  update({ entities, delta, ctx }: Context) {
    this.speedY += GRAVITY / delta;
    this.speedY = this.speedY;

    this.cx += this.speedX / delta;
    this.cx = Math.max(
      BALL_RADIUS,
      Math.min(this.cx, window.innerWidth - BALL_RADIUS)
    );
    this.cy += this.speedY / delta;

    entities.forEach((entity) => {
      if (entity === this) {
        return;
      }

      if (
        this.speedY > 0 &&
        this.getBoundingRect().intersects(entity.getBoundingRect(ctx))
      ) {
        this.speedY = JUMP_SPEED;
      }
    });
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, BALL_RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  shouldBeRemoved(): boolean {
    return this.cy - 2 * BALL_RADIUS > window.innerHeight;
  }

  getBoundingRect(): Rect {
    return new Rect(
      this.cx - BALL_RADIUS,
      this.cy + BALL_RADIUS - 1,
      2 * BALL_RADIUS,
      1
    );
  }
}
