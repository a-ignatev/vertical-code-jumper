import { Graphics } from "engine/graphics/Graphics";
import { Scene } from "engine/scenes/Scene";
import { Sound } from "engine/sound/Sound";
import { SCORE_COLOR } from "game/entities/Score";
import { StaticWord } from "game/entities/Word";

export class GameOver extends Scene {
  private gameOverSound: Sound;
  private music: Sound;

  constructor(music: Sound) {
    super();

    this.music = music;
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.gameOverSound = new Sound("game-over.mp3");
  }

  attach(graphics: Graphics, payload: { score: number }): void {
    this.music.stop();

    if (!this.gameOverSound.isPlaying()) {
      this.gameOverSound.play();
    }

    const jobTitleText = this.getJobTitle(payload.score);
    const gameOverText = "Game Over";
    const helpText = "Click or press Space";
    const help2Text = "to play again";
    const scoreText = payload.score.toString();

    const gameOver = new StaticWord(
      gameOverText,
      graphics.getWidth() / 2 - graphics.measureText(gameOverText).width / 2,
      graphics.getHeight() / 2 - 6 * globalFontSize,
      graphics
    );

    const jobTitle = new StaticWord(
      jobTitleText,
      graphics.getWidth() / 2 - graphics.measureText(jobTitleText).width / 2,
      graphics.getHeight() / 2 - globalFontSize,
      graphics
    );

    const score = new StaticWord(
      scoreText,
      graphics.getWidth() / 2 - graphics.measureText(scoreText).width / 2,
      graphics.getHeight() / 2 + globalFontSize,
      graphics
    );

    score.color = SCORE_COLOR;

    const help = new StaticWord(
      helpText,
      graphics.getWidth() / 2 - graphics.measureText(helpText).width / 2,
      graphics.getHeight() / 2 + 4 * globalFontSize,
      graphics
    );
    const help2 = new StaticWord(
      help2Text,
      graphics.getWidth() / 2 - graphics.measureText(help2Text).width / 2,
      graphics.getHeight() / 2 + 6 * globalFontSize,
      graphics
    );

    this.addEntity("jobTitle", jobTitle);
    this.addEntity("score", score);
    this.addEntity("title", gameOver);
    this.addEntity("help", help);
    this.addEntity("help2", help2);

    graphics.addScreenEventListener("click", this.onClick);
    window.addEventListener("keydown", this.onKeyDown);
  }

  detach(graphics: Graphics): void {
    graphics.removeScreenEventListener("click", this.onClick);
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
    this.music.play();
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
      this.getSceneManager().switchScene("game");
      this.music.play();
    }
  }
}
