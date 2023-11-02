import { Scene } from "engine/scenes/Scene";
import { AnimatedArrow } from "game/entities/AnimatedArrow";
import { StaticWord } from "game/entities/Word";
import { isScreenTooSmall } from "game/helpers";

export class Resize extends Scene {
  attach(ctx: CanvasRenderingContext2D): void {
    const baseY = ctx.canvas.height / 2;
    const message = "Resize";
    const halfMessageLength = ctx.measureText("Resize").width / 2;

    const resize = new StaticWord(
      message,
      ctx.canvas.width / 2 - halfMessageLength,
      baseY,
      ctx
    );

    const left = new AnimatedArrow(
      ctx,
      ctx.canvas.width / 2 - halfMessageLength,
      baseY,
      isScreenTooSmall(ctx) ? "left" : "right",
      "left"
    );
    const right = new AnimatedArrow(
      ctx,
      ctx.canvas.width / 2 + halfMessageLength,
      baseY,
      isScreenTooSmall(ctx) ? "right" : "left",
      "right"
    );

    this.addEntity("resize", resize);
    this.addEntity("left", left);
    this.addEntity("right", right);
  }

  detach() {}
}
