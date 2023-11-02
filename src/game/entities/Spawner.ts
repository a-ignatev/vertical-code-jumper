import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Graphics } from "engine/graphics/Graphics";
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
  graphics: Graphics,
  guy: Guy,
  xPositionGenerator: (
    graphics: Graphics,
    x: number
  ) => number = getRandomWordXNotCloseTo
) =>
  new Spawner(
    "commit",
    () =>
      new Commit(
        xPositionGenerator(graphics, guy.getPosition().cx),
        0,
        graphics
      ),
    2.5
  );

export const createWordSpawner = (
  graphics: Graphics,
  words: string[],
  guy: Guy
) =>
  new Spawner(
    "word",
    () => Word.randomWord(words, guy.getPosition().cx, graphics),
    1,
    true
  );

export const createCoffeeMugSpawner = (graphics: Graphics) =>
  new Spawner(
    "coffeeMug",
    (spawner: Spawner) => {
      if (!spawner.getScene().getEntity("coffeeWave")) {
        return new CoffeeMug(graphics);
      }
    },
    6
  );
