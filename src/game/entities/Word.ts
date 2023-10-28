import { Context, Entity } from "./Entity";
import { Rect } from "./Rect";

const FALLING_SPEED = 30;

function getColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function getRandomWord(words: string[]) {
  return words[Math.floor(Math.random() * words.length)];
}

function getRandomWordX() {
  return Math.random() * window.innerWidth - 20;
}

export class Word extends Entity {
  x: number;
  y: number;
  word: string;
  color: string;

  constructor(word: string, x: number, y: number) {
    super();

    this.word = word;
    this.x = x;
    this.y = y;
    this.color = getColor("--vscode-editor-foreground");
  }

  static randomWord(words: string[]) {
    return new Word(getRandomWord(words), getRandomWordX(), 0);
  }

  update({ delta }: Context) {
    this.y += FALLING_SPEED / delta;
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    ctx.fillStyle = this.color;
    ctx.fillText(this.word, this.x, this.y);

    if (debug) {
      this.getBoundingRect(ctx).render(ctx);
    }
  }

  tryDestroyEntity(): boolean {
    return this.y - globalFontSize > window.innerHeight;
  }

  getBoundingRect(ctx: CanvasRenderingContext2D): Rect {
    const measure = ctx.measureText(this.word);

    return new Rect(
      this.x,
      this.y - globalFontSize,
      measure.width,
      globalFontSize
    );
  }
}

export class StaticWord extends Word {
  update(): void {}
}
