import { Graphics } from "engine/core/Graphics";
import { Scene } from "engine/scenes/Scene";
import { StaticWord } from "game/entities/StaticWord";

export class Loading extends Scene {
  attach(graphics: Graphics): void {
    const text = "Loading...";

    this.spawnEntity(
      "loading",
      StaticWord,
      text,
      graphics.getWidth() / 2 - graphics.measureText(text).width / 2,
      graphics.getHeight() / 2
    );
  }
  detach() {}
}
