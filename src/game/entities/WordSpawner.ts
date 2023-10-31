import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Guy } from "./Guy";
import { Word } from "./Word";

const SPAWN_PERIOD = 1;

export class WordSpawner extends Entity {
  private timeWithoutSpawn = -1;
  private words: string[];
  private ctx: CanvasRenderingContext2D;

  constructor(words: string[], ctx: CanvasRenderingContext2D) {
    super();

    this.words = words;
    this.ctx = ctx;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta }: Context): void {
    this.timeWithoutSpawn += delta;

    if (this.timeWithoutSpawn < 0 || this.timeWithoutSpawn >= SPAWN_PERIOD) {
      this.timeWithoutSpawn = 0;
      const guy = this.getScene().getEntity<Guy>("guy");

      if (guy) {
        this.getScene().addEntity(
          "word",
          Word.randomWord(this.words, guy.getPosition().cx, this.ctx)
        );
      }
    }
  }

  render(): void {}
}
