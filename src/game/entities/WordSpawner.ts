import { Context, Entity } from "../../engine/entities/Entity";
import { Rect } from "../../engine/entities/Rect";
import { Word } from "./Word";

const SPAWN_PERIOD = 1000; //1s

export class WordSpawner extends Entity {
  private timeWithoutSpawn = 0;
  private words: string[];

  constructor(words: string[]) {
    super();

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

  tryDestroyEntity(): boolean {
    return false;
  }
}
