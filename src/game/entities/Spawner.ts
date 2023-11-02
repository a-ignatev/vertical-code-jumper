import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { getRandomWordXNotCloseTo } from "game/helpers";
import { CoffeeMug } from "./CoffeeMug";
import { Commit } from "./Commit";
import { Guy } from "./Guy";
import { Word } from "./Word";

export class Spawner extends Entity {
  private timeWithoutSpawn = -1;
  private entityName: string;
  private spawnPeriod: number;
  private spawnOnStart: boolean;
  private entityBuilder: (spawner: Spawner) => Entity | undefined;

  constructor(
    entityName: string,
    entityBuilder: (spawner: Spawner) => Entity | undefined,
    spawnPeriod: number,
    spawnOnStart: boolean = false
  ) {
    super();

    this.entityName = entityName;
    this.spawnPeriod = spawnPeriod;
    this.spawnOnStart = spawnOnStart;
    this.entityBuilder = entityBuilder;
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  update({ delta }: Context): void {
    this.timeWithoutSpawn += delta;

    if (
      (this.spawnOnStart && this.timeWithoutSpawn < 0) ||
      this.timeWithoutSpawn >= this.spawnPeriod
    ) {
      this.timeWithoutSpawn = 0;
      const guy = this.getScene().getEntity<Guy>("guy");

      if (guy) {
        const entity = this.entityBuilder(this);

        if (entity) {
          this.getScene().addEntity(this.entityName, entity);
        }
      }
    }
  }

  render(): void {}
}

export const createCommitSpawner = (
  ctx: CanvasRenderingContext2D,
  guy: Guy,
  xPositionGenerator: (
    ctx: CanvasRenderingContext2D,
    x: number
  ) => number = getRandomWordXNotCloseTo
) =>
  new Spawner(
    "commit",
    () => new Commit(xPositionGenerator(ctx, guy.getPosition().cx), 0, ctx),
    2.5
  );

export const createWordSpawner = (
  ctx: CanvasRenderingContext2D,
  words: string[],
  guy: Guy
) =>
  new Spawner(
    "word",
    () => Word.randomWord(words, guy.getPosition().cx, ctx),
    1,
    true
  );

export const createCoffeeMugSpawner = (ctx: CanvasRenderingContext2D) =>
  new Spawner(
    "coffeeMug",
    (spawner: Spawner) => {
      if (!spawner.getScene().getEntity("coffeeWave")) {
        return new CoffeeMug(ctx);
      }
    },
    6
  );
