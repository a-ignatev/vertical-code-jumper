import { Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";

const TEXT = "x2";

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

  update(): void {
    if (this.isGrowing === true) {
      this.scale -= 0.05;
    } else {
      this.scale += 0.05;
    }

    if (this.scale > 2) {
      this.isGrowing = true;
    }

    if (this.scale < 0.6) {
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
    ctx.fillStyle = "#EDBB4E";
    ctx.fillText(
      TEXT,
      window.innerWidth / 2 - (this.originalTextWidth / 2) * this.scale,
      20
    );
  }
}
