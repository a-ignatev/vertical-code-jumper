import { Graphics } from "engine/graphics/Graphics";
import { Scene } from "engine/scenes/Scene";
import { AnimatedArrow } from "game/entities/AnimatedArrow";
import { StaticWord } from "game/entities/Word";

export class Resize extends Scene {
  attach(graphics: Graphics): void {
    const baseY = graphics.getHeight() / 2;
    const message = "Resize";
    const halfMessageLength = graphics.measureText("Resize").width / 2;

    const resize = new StaticWord(
      message,
      graphics.getWidth() / 2 - halfMessageLength,
      baseY,
      graphics
    );

    const left = new AnimatedArrow(
      graphics,
      graphics.getWidth() / 2 - halfMessageLength,
      baseY,
      graphics.isScreenTooSmall() ? "left" : "right",
      "left"
    );
    const right = new AnimatedArrow(
      graphics,
      graphics.getWidth() / 2 + halfMessageLength,
      baseY,
      graphics.isScreenTooSmall() ? "right" : "left",
      "right"
    );

    this.addEntity("resize", resize);
    this.addEntity("left", left);
    this.addEntity("right", right);
  }

  detach() {}
}
