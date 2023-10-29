import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { getRandomWordXNotCloseTo } from "game/helpers";
import { Commit } from "./Commit";
import { Guy } from "./Guy";
import { Score } from "./Score";

const SPAWN_PERIOD = 2500;

export class CommitSpawner extends Entity {
  private timeWithoutSpawn = 0;
  private guy: Guy;
  private score: Score | null;
  private xPositionGenerator: (x: number) => number;
  private ctx: CanvasRenderingContext2D;

  constructor(
    guy: Guy,
    ctx: CanvasRenderingContext2D,
    score: Score | null,
    xPositionGenerator = getRandomWordXNotCloseTo
  ) {
    super();

    this.ctx = ctx;
    this.guy = guy;
    this.score = score;
    this.timeWithoutSpawn = 0;
    this.xPositionGenerator = xPositionGenerator;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta, entities }: Context): void {
    this.timeWithoutSpawn += delta;

    if (!this.timeWithoutSpawn || this.timeWithoutSpawn >= SPAWN_PERIOD) {
      this.timeWithoutSpawn = 0;
      entities.push(
        new Commit(
          this.xPositionGenerator(this.guy.cx),
          0,
          this.score,
          this.ctx
        )
      );
    }
  }

  render(): void {}

  tryDestroyEntity(): boolean {
    return false;
  }
}
