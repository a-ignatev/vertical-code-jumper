import { Rect } from "engine/components/Rect";
import { StaticImage } from "engine/components/StaticImage";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { getRandomWordX } from "game/helpers";
import { BonusIndicator } from "./BonusIndicator";
import { CoffeeWave } from "./CoffeeWave";
import { Guy } from "./Guy";
import { LifeBar } from "./LifeBar";

const MUG_SIZE = 16;
const FALLING_SPEED = 200;

export class CoffeeMug extends Entity {
  constructor(scene: Scene) {
    super(scene);

    const graphics = this.getScene().getSceneManager().getGraphics();
    this.getTransform().setPosition(getRandomWordX(graphics), -MUG_SIZE);
    this.addComponent("mug", StaticImage, "mug.png", MUG_SIZE, MUG_SIZE);
    this.addComponent("collisionBox", Rect, MUG_SIZE, MUG_SIZE, "#00FF00");
  }

  update({ delta }: Context): void {
    this.getTransform().translate(0, FALLING_SPEED * delta);

    const guy = this.getScene().getEntity<Guy>("guy");
    const guyBox = guy?.getComponent<Rect>("fullBoundingBox");

    if (guyBox && this.getComponent<Rect>("collisionBox")?.intersects(guyBox)) {
      this.getScene().removeEntity(this);

      if (!this.getScene().getEntity("coffeeWave")) {
        this.getScene().spawnEntity("coffeeWave", CoffeeWave);
        this.getScene().getEntity<LifeBar>("lifeBar")?.reset();
        this.getScene()
          .getEntity<BonusIndicator>("bonusIndicator")
          ?.setIsHidden(false);
      }
    }
  }

  getZOrder(): number {
    return 2;
  }
}
