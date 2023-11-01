import { Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";

type Direction = "left" | "right";

export class AnimatedArrow extends Entity {
  private direction: Direction;
  private side: Direction;
  private isGrowing: boolean = true;
  private scale: number = 1;
  private originalTextWidth: number;
  private x: number;
  private y: number;
  private font: string;
  private height: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    direction: "left" | "right",
    side: "left" | "right"
  ) {
    super();

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.side = side;
    this.font = `${globalFontSize * 3}px ${globalFontFamily.split(",")[0]}`;
    ctx.font = this.font;
    const measure = ctx.measureText("←");
    this.originalTextWidth = measure.width;
    this.height =
      measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
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

  render(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.font;

    const shift = (this.originalTextWidth / 2) * this.scale;
    const y = this.y + this.height / 2;

    if (this.direction === "left" && this.side === "left") {
      ctx.fillText("←", this.x - this.originalTextWidth - shift, y);
    }

    if (this.direction === "left" && this.side === "right") {
      ctx.fillText("←", this.x + shift, y);
    }

    if (this.direction === "right" && this.side === "left") {
      ctx.fillText("→", this.x - this.originalTextWidth - shift, y);
    }

    if (this.direction === "right" && this.side === "right") {
      ctx.fillText("→", this.x + shift, y);
    }
  }
}