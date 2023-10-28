import { SCORE_COLOR } from "../entities/Score";
import { StaticWord } from "../entities/Word";
import { Sound } from "../sound/Sound";
import { Scene } from "./Scene";

export class GameOver extends Scene {
  private ctx: CanvasRenderingContext2D;
  gameOverSound: Sound;

  constructor(ctx: CanvasRenderingContext2D) {
    super();

    this.ctx = ctx;

    this.onClick = this.onClick.bind(this);
    this.gameOverSound = new Sound("negative_beeps-6008.mp3");
  }

  attach(payload: { score: number }): void {
    this.gameOverSound.play();

    const titleText = "Game Over";
    const helpText = "Click to play again";
    const scoreText = payload.score.toString();

    const score = new StaticWord(
      scoreText,
      window.innerWidth / 2 - this.ctx.measureText(scoreText).width / 2,
      window.innerHeight / 2
    );

    score.color = SCORE_COLOR;

    const title = new StaticWord(
      titleText,
      window.innerWidth / 2 - this.ctx.measureText(titleText).width / 2,
      window.innerHeight / 2 + 2 * globalFontSize
    );

    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - this.ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize
    );

    this.setEntities([score, title, help]);

    window.addEventListener("click", this.onClick);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
  }

  private onClick() {
    this.sceneManager?.switchScene("game");
  }
}
