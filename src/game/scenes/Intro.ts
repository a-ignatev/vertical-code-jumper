import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { Guy } from "game/entities/Guy";
import { StaticWord } from "game/entities/Word";

export class Intro extends Scene {
  private ctx: CanvasRenderingContext2D;
  private music: Sound;

  constructor(ctx: CanvasRenderingContext2D, music: Sound) {
    super();

    this.ctx = ctx;
    this.music = music;

    if (!this.music.isPlaying()) {
      this.music.play();
    }

    this.onClick = this.onClick.bind(this);
  }

  attach(): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    const guy = new Guy(window.innerWidth / 2, window.innerHeight / 2, false);
    const title = new StaticWord(
      titleText,
      window.innerWidth / 2 - this.ctx.measureText(titleText).width / 2,
      window.innerHeight / 2 + 2 * globalFontSize
    );

    const keys = new StaticWord(
      keysText,
      window.innerWidth / 2 - this.ctx.measureText(keysText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize
    );
    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - this.ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 6 * globalFontSize
    );

    this.setEntities([guy, title, help, keys]);

    window.addEventListener("click", this.onClick);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
  }

  private onClick() {
    this.sceneManager?.switchScene("game");

    if (!this.music.isPlaying()) {
      this.music.play();
    }
  }
}
