import { Graphics } from "engine/core/Graphics";
import { Scene } from "engine/scenes/Scene";
import { SceneManager } from "engine/scenes/SceneManager";
import { Commit } from "game/entities/Commit";
import { Guy } from "game/entities/Guy";
import { StaticWord } from "game/entities/StaticWord";
import { Timer } from "game/entities/Timer";

export class Intro extends Scene {
  constructor(sceneManager: SceneManager) {
    super(sceneManager);

    this.onClick = this.onClick.bind(this);
  }

  attach(graphics: Graphics): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    this.spawnEntity("guy", Guy, graphics.getWidth() / 2, 0, false);
    this.spawnEntity(
      "title",
      StaticWord,
      titleText,
      graphics.getWidth() / 2 - graphics.measureText(titleText).width / 2,
      graphics.getHeight() / 2 + 2 * globalFontSize
    );
    this.spawnEntity(
      "help",
      StaticWord,
      helpText,
      graphics.getWidth() / 2 - graphics.measureText(helpText).width / 2,
      graphics.getHeight() / 2 + 6 * globalFontSize
    );
    this.spawnEntity(
      "keys",
      StaticWord,
      keysText,
      graphics.getWidth() / 2 - graphics.measureText(keysText).width / 2,
      graphics.getHeight() / 2 + 4 * globalFontSize
    );
    this.spawnEntity("commitSpawner", Timer, 2.5, false, () => {
      this.spawnEntity("commit", Commit);
    });

    graphics.addScreenEventListener("click", this.onClick);
  }

  detach(graphics: Graphics): void {
    graphics.removeScreenEventListener("click", this.onClick);
  }

  private onClick() {
    this.getSceneManager().switchScene("game");
  }
}
