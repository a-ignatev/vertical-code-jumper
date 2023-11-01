import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { getRandomWordX } from "game/helpers";
import { BonusIndicator } from "./BonusIndicator";
import { CoffeeWave } from "./CoffeeWave";
import { Guy } from "./Guy";
import { LifeBar } from "./LifeBar";

const MUG_SIZE = 16;
const FALLING_SPEED = 300;

export class CoffeeMug extends Entity {
  private cx: number;
  private cy: number;
  private img: HTMLImageElement;

  constructor() {
    super();

    this.cx = getRandomWordX();
    this.cy = -MUG_SIZE;
    this.img = new Image(); // Create new img element
    this.img.src = mediaFolder + "/img/mug.png"; // Set source path
  }

  getBoundingRect(): Rect {
    return new Rect(
      this.cx - MUG_SIZE / 2,
      this.cy + MUG_SIZE / 2,
      MUG_SIZE,
      MUG_SIZE
    );
  }

  update({ delta }: Context): void {
    this.cy += FALLING_SPEED * delta;

    const guy = this.getScene().getEntity<Guy>("guy");

    if (guy && this.getBoundingRect().intersects(guy.getFullBoundingBox())) {
      this.getScene().removeEntity(this);

      if (!this.getScene().getEntity("coffeeWave")) {
        this.getScene().addEntity("coffeeWave", new CoffeeWave());
        this.getScene().getEntity<LifeBar>("lifeBar")?.reset();
        this.getScene()
          .getEntity<BonusIndicator>("bonusIndicator")
          ?.setIsHidden(false);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean): void {
    ctx.drawImage(
      this.img,
      this.cx - MUG_SIZE / 2,
      this.cy + MUG_SIZE / 2,
      MUG_SIZE,
      MUG_SIZE
    );

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  getZOrder(): number {
    return 2;
  }
}
