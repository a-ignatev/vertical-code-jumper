import { Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { ColorBox } from "game/components/ColorBox";
import { DangerIndicatorBackground } from "game/components/DangerIndicatorBackground";

export class DangerIndicator extends Entity {
  private screenHeight: number;
  private lowerBoundary: number;

  constructor(scene: Scene) {
    super(scene);

    this.addComponent("dangerIndicatorBackground", DangerIndicatorBackground);

    this.screenHeight = this.getScene()
      .getSceneManager()
      .getGraphics()
      .getHeight();

    this.lowerBoundary = (2 * this.screenHeight) / 3;
  }

  update(): void {
    let lowestCommit = 0;

    const coffeeWave = this.getScene().getEntity("coffeeWave");

    if (!coffeeWave) {
      for (const entity of this.getScene().getEntities()) {
        const isCommit = entity.getComponent<ColorBox>("addedText");

        if (isCommit) {
          if (
            entity.getTransform().getY() > lowestCommit &&
            entity.getTransform().getY() > this.lowerBoundary
          ) {
            lowestCommit = entity.getTransform().getY();
          }
        }
      }
    }

    let factor;

    if (lowestCommit < this.lowerBoundary) {
      factor = 0;
    } else {
      factor = Math.min(
        (lowestCommit - this.lowerBoundary) / this.screenHeight,
        0.7
      );
    }

    this.getComponent<DangerIndicatorBackground>(
      "dangerIndicatorBackground"
    )?.setDangerLevelFactor(factor);
  }

  getZOrder(): number {
    return 100;
  }
}
