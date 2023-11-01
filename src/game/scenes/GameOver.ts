import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { SCORE_COLOR } from "game/entities/Score";
import { StaticWord } from "game/entities/Word";

export class GameOver extends Scene {
  gameOverSound: Sound;

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.gameOverSound = new Sound("game-over.mp3");
  }

  attach(ctx: CanvasRenderingContext2D, payload: { score: number }): void {
    this.gameOverSound.play();

    const jobTitleText = this.getJobTitle(payload.score);
    const gameOverText = "Game Over";
    const helpText = "Click or press Space";
    const help2Text = "to play again";
    const scoreText = payload.score.toString();

    const gameOver = new StaticWord(
      gameOverText,
      window.innerWidth / 2 - ctx.measureText(gameOverText).width / 2,
      window.innerHeight / 2 - 6 * globalFontSize,
      ctx
    );

    const jobTitle = new StaticWord(
      jobTitleText,
      window.innerWidth / 2 - ctx.measureText(jobTitleText).width / 2,
      window.innerHeight / 2 - globalFontSize,
      ctx
    );

    const score = new StaticWord(
      scoreText,
      window.innerWidth / 2 - ctx.measureText(scoreText).width / 2,
      window.innerHeight / 2 + globalFontSize,
      ctx
    );

    score.color = SCORE_COLOR;

    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize,
      ctx
    );
    const help2 = new StaticWord(
      help2Text,
      window.innerWidth / 2 - ctx.measureText(help2Text).width / 2,
      window.innerHeight / 2 + 6 * globalFontSize,
      ctx
    );

    this.addEntity("jobTitle", jobTitle);
    this.addEntity("score", score);
    this.addEntity("title", gameOver);
    this.addEntity("help", help);
    this.addEntity("help2", help2);

    window.addEventListener("click", this.onClick);
    window.addEventListener("keydown", this.onKeyDown);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private multiplier = 2000;

  private titles = [
    { name: "Junior", limit: 1 },
    { name: "Advanced Junior", limit: 1.4 },
    { name: "Regular", limit: 1.8 },
    { name: "Senior", limit: 2.4 },
    { name: "Strong Senior", limit: 3 },
    { name: "Staff", limit: 4 },
    { name: "Senior Staff", limit: 5 },
    { name: "Principal", limit: 7 },
  ];

  private getJobTitle(score: number) {
    const titleIndex =
      this.titles.findIndex(({ limit }) => limit * this.multiplier > score) ||
      0;

    return this.titles[titleIndex].name + " Engineer";
  }

  private onClick() {
    this.getSceneManager().switchScene("game");
  }

  private onKeyDown() {
    this.getSceneManager().switchScene("game");
  }
}
