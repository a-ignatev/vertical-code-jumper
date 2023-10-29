import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { SCORE_COLOR } from "game/entities/Score";
import { StaticWord } from "game/entities/Word";

export class GameOver extends Scene {
  gameOverSound: Sound;

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.gameOverSound = new Sound("game-over.mp3");
  }

  attach(ctx: CanvasRenderingContext2D, payload: { score: number }): void {
    this.gameOverSound.play();

    const jobTitleText = this.getJobTitle(payload.score);
    const titleText = "Game Over";
    const helpText = "Click to play again";
    const scoreText = payload.score.toString();

    const score = new StaticWord(
      scoreText,
      window.innerWidth / 2 - ctx.measureText(scoreText).width / 2,
      window.innerHeight / 2,
      ctx
    );

    score.color = SCORE_COLOR;

    const title = new StaticWord(
      titleText,
      window.innerWidth / 2 - ctx.measureText(titleText).width / 2,
      window.innerHeight / 2 + 2 * globalFontSize,
      ctx
    );

    const jobTitle = new StaticWord(
      jobTitleText,
      window.innerWidth / 2 - ctx.measureText(jobTitleText).width / 2,
      window.innerHeight / 2 - 2 * globalFontSize,
      ctx
    );

    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize,
      ctx
    );

    this.addEntity("jobTitle", jobTitle);
    this.addEntity("score", score);
    this.addEntity("title", title);
    this.addEntity("help", help);

    window.addEventListener("click", this.onClick);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
  }

  private titles = [
    { name: "Junior", limit: 1000 },
    { name: "Advanced Junior", limit: 1400 },
    { name: "Regular", limit: 1800 },
    { name: "Senior", limit: 2400 },
    { name: "Strong Senior", limit: 3000 },
    { name: "Staff", limit: 4000 },
    { name: "Senior Staff", limit: 5000 },
    { name: "Principal", limit: 6000 },
  ];

  private getJobTitle(score: number) {
    const titleIndex = this.titles.findIndex(({ limit }) => limit > score) || 0;

    return this.titles[titleIndex].name + " Engineer";
  }

  private onClick() {
    this.getSceneManager().switchScene("game");
  }
}
