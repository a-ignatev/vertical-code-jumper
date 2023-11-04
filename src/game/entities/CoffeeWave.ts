import { Sound } from "engine/components/Sound";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { CoffeeWaveAnimation } from "game/components/CoffeeWaveAnimation";
import { BonusIndicator } from "./BonusIndicator";

export class CoffeeWave extends Entity {
  constructor(scene: Scene) {
    super(scene);

    this.addComponent("coffeeWaveAnimation", CoffeeWaveAnimation, () => {
      this.getScene().removeEntity(this);
      this.getScene()
        .getEntity<BonusIndicator>("bonusIndicator")
        ?.setIsHidden(true);
    });
    const pouringSound = this.addComponent(
      "pouringSound",
      Sound,
      "pouring-drink.mp3"
    );

    pouringSound.setCurrentTime(0.2);
    pouringSound.play();
  }

  update({ delta }: Context): void {
    this.getComponent<CoffeeWaveAnimation>("coffeeWaveAnimation")?.update(
      delta
    );
  }

  getZOrder(): number {
    return -100;
  }
}
