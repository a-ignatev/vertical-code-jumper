import { Rect } from "engine/components/Rect";
import { Text } from "engine/components/Text";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { getRandomWordXNotCloseTo } from "game/helpers";

const FALLING_SPEED = 150;
const PADDING = globalFontSize;

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
    const randomX = getRandomWordXNotCloseTo(graphics, notCloseToX);
    const text = this.getComponent<Text>("text");

    if (!text) {
      return;
    }

    this.getTransform().setPosition(
      Math.min(
        Math.max(randomX, PADDING),
        // start of the word should be that the word would fit the screen
        graphics.getWidth() - text.getWidth() - PADDING
      ),
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
