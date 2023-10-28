import { Context, Entity } from "./Entity";
import { Rect } from "./Rect";
import { Word } from "./Word";

const SPAWN_PERIOD = 1000; //1s

export class WordSpawner implements Entity {
  private timeWithoutSpawn = 0;
  private words: string[];

  constructor(words: string[]) {
    this.timeWithoutSpawn = 0;
    this.words = words;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta, entities }: Context): void {
    this.timeWithoutSpawn += delta;

    if (!this.timeWithoutSpawn || this.timeWithoutSpawn >= SPAWN_PERIOD) {
      this.timeWithoutSpawn = 0;
      entities.push(Word.randomWord(this.words));
    }
  }

  render(): void {}

  shouldBeRemoved(): boolean {
    return false;
  }
}
