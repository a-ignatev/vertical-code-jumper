import { Text } from "engine/components/Text";
import { Context } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { FallingWord } from "./FallingWord";

const MOVING_SPEED = 100;
const PADDING = globalFontSize;

export class MovingWord extends FallingWord {
  private isGoingRight = Math.random() > 0.5;
  private speedX = 0;
  private rightLimit: number;

  constructor(scene: Scene, words: string[]) {
    super(scene, words);

    const graphics = this.getScene().getSceneManager().getGraphics();
    this.rightLimit =
      graphics.getWidth() -
      this.getComponent<Text>("text")!.getWidth() -
      PADDING;
  }

  update({ delta }: Context) {
    super.update({ delta });

    if (this.isGoingRight) {
      this.speedX = MOVING_SPEED;
    } else {
      this.speedX = -MOVING_SPEED;
    }

    this.getTransform().translate(this.speedX * delta, 0);

    if (this.getTransform().getX() >= this.rightLimit) {
      this.isGoingRight = false;
    }

    if (this.getTransform().getX() < PADDING) {
      this.isGoingRight = true;
    }
  }
}
