import { Rect } from "engine/components/Rect";
import { Text } from "engine/components/Text";
import { Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

export class StaticWord extends Entity {
  constructor(scene: Scene, word: string, x: number, y: number) {
    super(scene);

    this.getTransform().setPosition(x, y);
    const text = this.addComponent("text", Text, word);
    const boundingBox = this.addComponent(
      "boundingBox",
      Rect,
      text.getWidth(),
      globalFontSize
    );
    boundingBox.pivot = { x: 0, y: -globalFontSize };
  }

  update(): void {}
}
