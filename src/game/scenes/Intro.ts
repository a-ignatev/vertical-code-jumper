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

  attach(ctx: CanvasRenderingContext2D): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    const guy = new Guy(ctx.canvas.width / 2, 0, false);
    const commitSpawner = createCommitSpawner(ctx, guy, getRandomWordX);
    const title = new StaticWord(
      titleText,
      ctx.canvas.width / 2 - ctx.measureText(titleText).width / 2,
      ctx.canvas.height / 2 + 2 * globalFontSize,
      ctx
    );

    const keys = new StaticWord(
      keysText,
      ctx.canvas.width / 2 - ctx.measureText(keysText).width / 2,
      ctx.canvas.height / 2 + 4 * globalFontSize,
      ctx
    );
    const help = new StaticWord(
      helpText,
      ctx.canvas.width / 2 - ctx.measureText(helpText).width / 2,
      ctx.canvas.height / 2 + 6 * globalFontSize,
      ctx
    );

    this.addEntity("guy", guy);
    this.addEntity("title", title);
    this.addEntity("help", help);
    this.addEntity("keys", keys);
    this.addEntity("commitSpawner", commitSpawner);

    ctx.canvas.addEventListener("click", this.onClick);
  }

  detach(ctx: CanvasRenderingContext2D): void {
    ctx.canvas.removeEventListener("click", this.onClick);
  }

  private onClick() {
    this.getSceneManager().switchScene("game");

    if (!this.music.isPlaying()) {
      this.music.play();
    }
  }
}
