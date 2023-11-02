import { Graphics } from "engine/graphics/Graphics";
import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { Guy } from "game/entities/Guy";
import { createCommitSpawner } from "game/entities/Spawner";
import { StaticWord } from "game/entities/Word";
import { getRandomWordX } from "game/helpers";

export class Intro extends Scene {
  private music: Sound;

  constructor(music: Sound) {
    super();

    this.music = music;

    if (!this.music.isPlaying()) {
      this.music.play();
    }

    this.onClick = this.onClick.bind(this);
  }

  attach(graphics: Graphics): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    const guy = new Guy(graphics.getWidth() / 2, 0, false);
    const commitSpawner = createCommitSpawner(graphics, guy, getRandomWordX);
    const title = new StaticWord(
      titleText,
      graphics.getWidth() / 2 - graphics.measureText(titleText).width / 2,
      graphics.getHeight() / 2 + 2 * globalFontSize,
      graphics
    );

    const keys = new StaticWord(
      keysText,
      graphics.getWidth() / 2 - graphics.measureText(keysText).width / 2,
      graphics.getHeight() / 2 + 4 * globalFontSize,
      graphics
    );
    const help = new StaticWord(
      helpText,
      graphics.getWidth() / 2 - graphics.measureText(helpText).width / 2,
      graphics.getHeight() / 2 + 6 * globalFontSize,
      graphics
    );

    this.addEntity("guy", guy);
    this.addEntity("title", title);
    this.addEntity("help", help);
    this.addEntity("keys", keys);
    this.addEntity("commitSpawner", commitSpawner);

    graphics.addScreenEventListener("click", this.onClick);
  }

  detach(graphics: Graphics): void {
    graphics.removeScreenEventListener("click", this.onClick);
  }

  private onClick() {
    this.getSceneManager().switchScene("game");

    if (!this.music.isPlaying()) {
      this.music.play();
    }
  }
}
