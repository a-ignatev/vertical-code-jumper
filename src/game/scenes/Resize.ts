import { Scene } from "engine/scenes/Scene";
import { AnimatedArrow } from "game/entities/AnimatedArrow";
import { StaticWord } from "game/entities/Word";
import { isScreenTooSmall } from "game/helpers";

export class Resize extends Scene {
  attach(ctx: CanvasRenderingContext2D): void {
    const baseY = window.innerHeight / 2;
    const message = "Resize";
    const halfMessageLength = ctx.measureText("Resize").width / 2;

    const resize = new StaticWord(
      message,
      window.innerWidth / 2 - halfMessageLength,
      baseY,
      ctx
    );

    const left = new AnimatedArrow(
      ctx,
      window.innerWidth / 2 - halfMessageLength,
      baseY,
      isScreenTooSmall() ? "left" : "right",
      "left"
    );
    const right = new AnimatedArrow(
      ctx,
      window.innerWidth / 2 + halfMessageLength,
      baseY,
      isScreenTooSmall() ? "right" : "left",
      "right"
    );

    this.addEntity("resize", resize);
    this.addEntity("left", left);
    this.addEntity("right", right);
  }

  detach() {}
}
