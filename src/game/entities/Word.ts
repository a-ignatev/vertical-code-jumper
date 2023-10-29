import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { getRandomWordXNotCloseTo } from "game/helpers";
import { getColor } from "game/helpers";

const FALLING_SPEED = 30;

function getRandomWord(words: string[]) {
  return words[Math.floor(Math.random() * words.length)];
}

export class Word extends Entity {
  private x: number;
  y: number;
  protected word: string;
  color: string;
  private font: string;
  private wordLength: number;

  constructor(
    word: string,
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D
  ) {
    super();

    this.word = word;
    this.x = x;
    this.y = y;
    this.font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;
    this.color = getColor("--vscode-editor-foreground");

    ctx.font = this.font;
    this.wordLength = ctx.measureText(this.word).width;
  }

  static randomWord(
    words: string[],
    notCloseTo: number,
    ctx: CanvasRenderingContext2D
  ) {
    return new Word(
      getRandomWord(words),
      getRandomWordXNotCloseTo(notCloseTo),
      0,
      ctx
    );
  }

  update({ delta }: Context) {
    this.y += FALLING_SPEED / delta;
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.word, this.x, this.y);

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  tryDestroyEntity(): boolean {
    return this.y - globalFontSize > window.innerHeight;
  }

  getBoundingRect(): Rect {
    return new Rect(
      this.x,
      this.y - globalFontSize,
      this.wordLength,
      globalFontSize
    );
  }
}

export class StaticWord extends Word {
  update(): void {}
}
