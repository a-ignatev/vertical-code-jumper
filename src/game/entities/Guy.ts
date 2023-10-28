import { Context, Entity } from "./Entity";
import { Rect } from "./Rect";

const WIDTH = 15;
const HEIGHT = 20;
const GRAVITY = 60;
const JUMP_SPEED = -130;
export const SIDE_SPEED = 60;

export class Guy implements Entity {
  speedX: number;
  speedY: number;
  private cx: number;
  private cy: number;
  img: HTMLImageElement;

  constructor(cx: number, cy: number) {
    this.speedX = 0;
    this.speedY = GRAVITY;
    this.cx = cx;
    this.cy = cy;

    this.img = new Image(); // Create new img element
    this.img.src = imgFolder + "/Normal_Guy_Air.png"; // Set source path
  }

  update({ entities, delta, ctx }: Context) {
    this.speedY += GRAVITY / delta;
    this.speedY = this.speedY;

    this.cx += this.speedX / delta;
    this.cx = Math.max(WIDTH, Math.min(this.cx, window.innerWidth - WIDTH));
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
    ctx.drawImage(
      this.img,
      this.cx - WIDTH,
      this.cy - HEIGHT,
      2 * WIDTH,
      2 * HEIGHT
    );

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  shouldBeRemoved(): boolean {
    return this.cy - 2 * HEIGHT > window.innerHeight;
  }

  getBoundingRect(): Rect {
    return new Rect(this.cx - WIDTH, this.cy + HEIGHT - 1, 2 * WIDTH, 1);
  }
}
