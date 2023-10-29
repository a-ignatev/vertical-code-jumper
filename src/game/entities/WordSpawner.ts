import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Guy } from "./Guy";
import { Word } from "./Word";

const SPAWN_PERIOD = 1000; //1s

export class WordSpawner extends Entity {
  private timeWithoutSpawn = 0;
  private words: string[];
  private guy: Guy;
  private ctx: CanvasRenderingContext2D;

  constructor(words: string[], guy: Guy, ctx: CanvasRenderingContext2D) {
    super();

    this.timeWithoutSpawn = 0;
    this.words = words;
    this.guy = guy;
    this.ctx = ctx;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta, entities }: Context): void {
    this.timeWithoutSpawn += delta;

    if (!this.timeWithoutSpawn || this.timeWithoutSpawn >= SPAWN_PERIOD) {
      this.timeWithoutSpawn = 0;
      entities.push(Word.randomWord(this.words, this.guy.cx, this.ctx));
    }
  }

  render(): void {}

  tryDestroyEntity(): boolean {
    return false;
  }
}
