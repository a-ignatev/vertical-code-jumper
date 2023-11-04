import { Rect } from "engine/components/Rect";
import { Text } from "engine/components/Text";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { getRandomWordXNotCloseTo } from "game/helpers";

const FALLING_SPEED = 150;

function getRandomWord(words: string[]) {
  return words[Math.floor(Math.random() * words.length)];
}

export class FallingWord extends Entity {
  private words: string[];

  constructor(scene: Scene, words: string[]) {
    super(scene);

    this.words = words;

    const text = this.addComponent("text", Text, getRandomWord(this.words));
    const boundingBox = this.addComponent(
      "boundingBox",
      Rect,
      text.getWidth(),
      globalFontSize
    );
    boundingBox.pivot = { x: 0, y: -globalFontSize };
  }

  randomize(notCloseToX: number) {
    const graphics = this.getScene().getSceneManager().getGraphics();
    this.getTransform().setPosition(
      getRandomWordXNotCloseTo(graphics, notCloseToX),
      0
    );
  }

  update({ delta }: Context) {
    this.getTransform().translate(0, FALLING_SPEED * delta);

    const graphics = this.getScene().getSceneManager().getGraphics();

    if (this.getTransform().getY() - globalFontSize > graphics.getHeight()) {
      this.getScene().removeEntity(this);
    }
  }
}
