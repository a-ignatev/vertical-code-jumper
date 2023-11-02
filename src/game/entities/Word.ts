import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Graphics } from "engine/graphics/Graphics";
import { getRandomWordXNotCloseTo } from "game/helpers";
import { getColor } from "game/helpers";

const FALLING_SPEED = 150;

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

  constructor(word: string, x: number, y: number, graphics: Graphics) {
    super();

    this.word = word;
    this.x = x;
    this.y = y;
    this.font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;
    this.color = getColor("--vscode-editor-foreground");

    graphics.setFont(this.font);
    this.wordLength = graphics.measureText(this.word).width;
  }

  static randomWord(words: string[], notCloseTo: number, graphics: Graphics) {
    return new Word(
      getRandomWord(words),
      getRandomWordXNotCloseTo(graphics, notCloseTo),
      0,
      graphics
    );
  }

  update({ delta }: Context) {
    this.y += FALLING_SPEED * delta;

    const graphics = this.getScene().getSceneManager().getGraphics();

    if (this.y - globalFontSize > graphics.getHeight()) {
      this.getScene().removeEntity(this);
    }
  }

  render(graphics: Graphics, debug: boolean) {
    graphics.setFont(this.font);
    graphics.setFillColor(this.color);
    graphics.fillText(this.word, this.x, this.y);

    if (debug) {
      this.getBoundingRect().render(graphics);
    }
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
