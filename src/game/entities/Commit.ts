import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { CoffeeWave } from "./CoffeeWave";
import { Guy } from "./Guy";
import { Score } from "./Score";

const FALLING_SPEED = 300;
const FONT_SIZE = globalFontSize * 0.8;
const BLOCK_SIZE = FONT_SIZE * 0.5;
const PADDING = 1;

export class Commit extends Entity {
  private addColor = "#3fb950";
  private removeColor = "#f85149";
  private neutralColor = "#6e768166";

  private x: number;
  private y: number;
  private blocks: string[];
  private addedText: string;
  private removedText: string;
  private totalLength: number;
  private addedLength: number;
  private removedLength: number;
  private blocksYOffset: number;

  constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
    super();

    this.x = x;
    this.y = y;

    const added = Math.round(Math.random() * 600);
    const removed = Math.round(Math.random() * 500);
    const neutral = Math.round(Math.random() * 200);
    const total = added + removed + neutral;
    const block = Math.round(total / 5);

    this.addedText = `+${added} `;
    this.removedText = `-${removed} `;
    this.blocks = [
      ...Array(Math.round(added / block)).fill(this.addColor),
      ...Array(Math.round(removed / block)).fill(this.removeColor),
      ...Array(Math.round(neutral / block)).fill(this.neutralColor),
    ].slice(0, 5);

    ctx.font = `${FONT_SIZE}px ${globalFontFamily.split(",")[0]}`;
    const measure = ctx.measureText(this.addedText + this.removedText);
    this.totalLength = measure.width + BLOCK_SIZE * 5 + PADDING * 5;
    const m = ctx.measureText(this.addedText);
    this.addedLength = m.width;
    this.removedLength = ctx.measureText(this.removedText).width;
    this.blocksYOffset =
      (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2 +
      BLOCK_SIZE / 2;
  }

  update({ delta }: Context): void {
    this.y += FALLING_SPEED * delta;

    const score = this.getScene().getEntity<Score>("score");

    if (score) {
      for (const entity of this.getScene().getEntities()) {
        if (
          entity instanceof Guy &&
          this.getBoundingRect().intersects(entity.getFullBoundingBox())
        ) {
          const coffeeWave =
            this.getScene().getEntity<CoffeeWave>("coffeeWave");

          if (coffeeWave) {
            score.addScore(200);
          } else {
            score.addScore(100);
          }
          this.getScene().removeEntity(this);
        }
      }
    }

    if (this.y - FONT_SIZE > window.innerHeight) {
      this.getScene().removeEntity(this);
    }
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    ctx.font = `${FONT_SIZE}px ${globalFontFamily.split(",")[0]}`;
    ctx.fillStyle = this.addColor;
    ctx.fillText(this.addedText, this.x, this.y);
    ctx.fillStyle = this.removeColor;
    ctx.fillText(this.removedText, this.x + this.addedLength, this.y);

    for (let i = 0; i < this.blocks.length; i++) {
      ctx.fillStyle = this.blocks[i];
      ctx.fillRect(
        this.x + this.addedLength + this.removedLength + BLOCK_SIZE * i + 1,
        this.y - this.blocksYOffset,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  getBoundingRect(): Rect {
    return new Rect(this.x, this.y - FONT_SIZE, this.totalLength, FONT_SIZE);
  }

  getZOrder(): number {
    return 2;
  }
}
