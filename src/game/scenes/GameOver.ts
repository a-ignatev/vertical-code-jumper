import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { SCORE_COLOR } from "game/entities/Score";
import { StaticWord } from "game/entities/Word";

export class GameOver extends Scene {
  private ctx: CanvasRenderingContext2D;
  gameOverSound: Sound;

  constructor(ctx: CanvasRenderingContext2D) {
    super();

    this.ctx = ctx;

    this.onClick = this.onClick.bind(this);
    this.gameOverSound = new Sound("game-over.mp3");
  }

  attach(payload: { score: number }): void {
    this.gameOverSound.play();

    const jobTitleText = this.getJobTitle(payload.score);
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

    const jobTitle = new StaticWord(
      jobTitleText,
      window.innerWidth / 2 - this.ctx.measureText(jobTitleText).width / 2,
      window.innerHeight / 2 - 2 * globalFontSize
    );

    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - this.ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize
    );

    this.setEntities([jobTitle, score, title, help]);

    window.addEventListener("click", this.onClick);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
  }

  private titles = [
    { name: "Junior", limit: 500 },
    { name: "Advanced Junior", limit: 700 },
    { name: "Regular", limit: 900 },
    { name: "Senior", limit: 1200 },
    { name: "Strong Senior", limit: 1500 },
    { name: "Staff", limit: 2000 },
    { name: "Senior Staff", limit: 2500 },
    { name: "Principal", limit: 3000 },
  ];

  private getJobTitle(score: number) {
    const titleIndex = this.titles.findIndex(({ limit }) => limit > score) || 0;

    return this.titles[titleIndex].name + " Engineer";
  }

  private onClick() {
    this.sceneManager?.switchScene("game");
  }
}
