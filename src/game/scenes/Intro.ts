import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { CommitSpawner } from "game/entities/CommitSpawner";
import { Guy } from "game/entities/Guy";
import { Score } from "game/entities/Score";
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

  attach(ctx: CanvasRenderingContext2D): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    const guy = new Guy(window.innerWidth / 2, window.innerHeight / 2, false);
    const commitSpawner = new CommitSpawner(guy, ctx, null, getRandomWordX);
    const title = new StaticWord(
      titleText,
      window.innerWidth / 2 - ctx.measureText(titleText).width / 2,
      window.innerHeight / 2 + 2 * globalFontSize,
      ctx
    );

    const keys = new StaticWord(
      keysText,
      window.innerWidth / 2 - ctx.measureText(keysText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize,
      ctx
    );
    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 6 * globalFontSize,
      ctx
    );

    this.setEntities([guy, title, help, keys, commitSpawner]);

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
