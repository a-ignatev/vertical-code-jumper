import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";

const TEXT = "x2";
const SCALE_SPEED = 3;
const MAX_SCALE = 2;
const MIN_SCALE = 0.6;
const COLOR = "#EDBB4E";

export class BonusIndicator extends Entity {
  private isHidden = true;
  private isGrowing: boolean = true;
  private scale: number = 1;
  private originalTextWidth: number;

  constructor(ctx: CanvasRenderingContext2D) {
    super();

    this.originalTextWidth = ctx.measureText(TEXT).width;
  }

  getBoundingRect(): Rect {
    throw new Error("Method not implemented.");
  }

  update({ delta }: Context): void {
    if (this.isGrowing === true) {
      this.scale -= SCALE_SPEED * delta;
    } else {
      this.scale += SCALE_SPEED * delta;
    }

    if (this.scale > MAX_SCALE) {
      this.isGrowing = true;
    }

    if (this.scale < MIN_SCALE) {
      this.isGrowing = false;
    }
  }

  setIsHidden(value: boolean) {
    this.isHidden = value;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.isHidden) {
      return;
    }

    ctx.font = `${globalFontSize * this.scale}px ${
      globalFontFamily.split(",")[0]
    }`;
    ctx.fillStyle = COLOR;
    ctx.fillText(
      TEXT,
      ctx.canvas.width / 2 - (this.originalTextWidth / 2) * this.scale,
      20
    );
  }
}
