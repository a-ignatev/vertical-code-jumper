import { Context, Entity } from "./Entity";
import { Rect } from "./Rect";

const WIDTH = 15;
const HEIGHT = 20;
const GRAVITY = 60;
const JUMP_SPEED = -130;
const FRAME_TIME = 1000 / 8; // 8fps
const DRINKING_PERIOD = 3000; // 3s
export const SIDE_SPEED = 60;

class Animation {
  spreadsheet: string;
  currentFrame = 0;
  elapsedTime = 0;
  img: HTMLImageElement;
  framesCount: number;
  cols: number;
  onEnd?: () => void;
  blocking: boolean;

  constructor({
    spreadsheet,
    frames,
    cols,
    blocking,
    onEnd,
  }: {
    spreadsheet: string;
    frames: number;
    cols: number;
    blocking: boolean;
    onEnd?: () => void;
  }) {
    this.spreadsheet = spreadsheet;
    this.img = new Image(); // Create new img element
    this.img.src = imgFolder + "/" + spreadsheet; // Set source path
    this.framesCount = frames;
    this.cols = cols;
    this.blocking = blocking;
    this.onEnd = onEnd;
  }

  update(delta: number) {
    this.elapsedTime += delta;

    if (this.elapsedTime >= FRAME_TIME) {
      this.elapsedTime = 0;

      if (this.currentFrame + 1 >= this.framesCount) {
        this.currentFrame = 0;
        this.onEnd?.();
      } else {
        this.currentFrame++;
      }
    }
  }

  render(cx: number, cy: number, ctx: CanvasRenderingContext2D) {
    const row = Math.trunc(this.currentFrame / this.cols);
    const col = this.currentFrame % this.cols;

    console.log({ row, col });

    ctx.drawImage(
      this.img,
      col * WIDTH,
      row * HEIGHT,
      WIDTH,
      HEIGHT,
      cx - WIDTH,
      cy - HEIGHT,
      2 * WIDTH,
      2 * HEIGHT
    );
  }
}

type AnimationType = "idle" | "falling" | "drinking";

export class Guy implements Entity {
  speedX: number;
  speedY: number;
  private cx: number;
  private cy: number;
  animations: Record<AnimationType, Animation>;
  currentAnimation: AnimationType;
  nonDrinkingTime: number;

  constructor(cx: number, cy: number) {
    this.speedX = 0;
    this.speedY = GRAVITY;
    this.cx = cx;
    this.cy = cy;

    this.animations = {
      falling: new Animation({
        spreadsheet: "Normal_Guy_Air.png",
        frames: 1,
        cols: 1,
        blocking: false,
      }),
      idle: new Animation({
        spreadsheet: "Normal_Guy_Idle_SpriteSheet.png",
        frames: 9,
        cols: 3,
        blocking: false,
      }),
      drinking: new Animation({
        spreadsheet: "Normal_Guy_Drinks_SpriteSheet.png",
        frames: 11,
        cols: 4,
        blocking: true,
        onEnd: () => {
          this.currentAnimation = "idle";
        },
      }),
    };

    this.nonDrinkingTime = 0;
    this.currentAnimation = "idle";
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

    if (!this.animations[this.currentAnimation].blocking) {
      if (this.speedY > GRAVITY / 2) {
        this.currentAnimation = "falling";
      } else {
        this.currentAnimation = "idle";
      }

      this.nonDrinkingTime += delta;
      if (this.nonDrinkingTime >= DRINKING_PERIOD) {
        this.nonDrinkingTime = 0;
        this.currentAnimation = "drinking";
      }
    }

    this.animations[this.currentAnimation].update(delta);
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    this.animations[this.currentAnimation].render(this.cx, this.cy, ctx);

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
