import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { getRandomWordXNotCloseTo } from "game/helpers";
import { Commit } from "./Commit";
import { Guy } from "./Guy";

const SPAWN_PERIOD = 2.5;

export class CommitSpawner extends Entity {
  private timeWithoutSpawn = 0;
  private xPositionGenerator: (x: number) => number;
  private ctx: CanvasRenderingContext2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    xPositionGenerator = getRandomWordXNotCloseTo
  ) {
    super();

    this.ctx = ctx;
    this.timeWithoutSpawn = 0;
    this.xPositionGenerator = xPositionGenerator;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta }: Context): void {
    this.timeWithoutSpawn += delta;

    if (this.timeWithoutSpawn >= SPAWN_PERIOD) {
      this.timeWithoutSpawn = 0;
      const guy = this.getScene().getEntity<Guy>("guy");

      if (guy) {
        this.getScene().addEntity(
          "commit",
          new Commit(this.xPositionGenerator(guy.getPosition().cx), 0, this.ctx)
        );
      }
    }
  }

  render(): void {}
}
