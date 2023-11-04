import { Graphics } from "engine/core/Graphics";
import { Scene } from "engine/scenes/Scene";
import { AnimatedArrow } from "game/entities/AnimatedArrow";
import { StaticWord } from "game/entities/StaticWord";

export class Resize extends Scene {
  attach(graphics: Graphics): void {
    const baseY = graphics.getHeight() / 2;
    const message = "Resize";
    const halfMessageLength = graphics.measureText("Resize").width / 2;

    this.spawnEntity(
      "resize",
      StaticWord,
      message,
      graphics.getWidth() / 2 - halfMessageLength,
      baseY
    );
    this.spawnEntity(
      "left",
      AnimatedArrow,
      graphics.getWidth() / 2 - halfMessageLength,
      baseY,
      graphics.isScreenTooSmall() ? "left" : "right",
      "left"
    );
    this.spawnEntity(
      "right",
      AnimatedArrow,
      graphics.getWidth() / 2 + halfMessageLength,
      baseY,
      graphics.isScreenTooSmall() ? "right" : "left",
      "right"
    );
  }

  detach() {}
}
