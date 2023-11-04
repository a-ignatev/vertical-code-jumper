import { Text } from "engine/components/Text";
import { Graphics } from "engine/core/Graphics";
import { SoundEmitter } from "engine/entities/SoundEmitter";
import { Scene } from "engine/scenes/Scene";
import { SceneManager } from "engine/scenes/SceneManager";
import { SCORE_COLOR } from "game/entities/Score";
import { StaticWord } from "game/entities/StaticWord";
import { getJobTitle } from "game/helpers";

export class GameOver extends Scene {
  constructor(sceneManager: SceneManager) {
    super(sceneManager);

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  attach(graphics: Graphics, payload: { score: number } | undefined): void {
    const jobTitleText = payload?.score ? getJobTitle(payload.score) : "";
    const gameOverText = "Game Over";
    const helpText = "Click or press Space";
    const help2Text = "to play again";
    const scoreText = payload?.score.toString() || "0";

    graphics.setFont(`${globalFontSize}px ${globalFontFamily.split(",")[0]}`);
    this.spawnEntity(
      "jobTitle",
      StaticWord,
      jobTitleText,
      graphics.getWidth() / 2 - graphics.measureText(jobTitleText).width / 2,
      graphics.getHeight() / 2 - globalFontSize
    );
    const score = this.spawnEntity(
      "score",
      StaticWord,
      scoreText,
      graphics.getWidth() / 2 - graphics.measureText(scoreText).width / 2,
      graphics.getHeight() / 2 + globalFontSize
    );
    score.getComponent<Text>("text")?.setColor(SCORE_COLOR);

    this.spawnEntity(
      "title",
      StaticWord,
      gameOverText,
      graphics.getWidth() / 2 - graphics.measureText(gameOverText).width / 2,
      graphics.getHeight() / 2 - 6 * globalFontSize
    );
    this.spawnEntity(
      "help",
      StaticWord,
      helpText,
      graphics.getWidth() / 2 - graphics.measureText(helpText).width / 2,
      graphics.getHeight() / 2 + 4 * globalFontSize
    );
    this.spawnEntity(
      "help2",
      StaticWord,
      help2Text,
      graphics.getWidth() / 2 - graphics.measureText(help2Text).width / 2,
      graphics.getHeight() / 2 + 6 * globalFontSize
    );
    const gameOverSound = this.spawnEntity(
      "gameOverSound",
      SoundEmitter,
      "game-over.mp3"
    );
    gameOverSound.play();

    graphics.addScreenEventListener("click", this.onClick);
    // todo encapsulate window events
    window.addEventListener("keydown", this.onKeyDown);
  }

  detach(graphics: Graphics): void {
    graphics.removeScreenEventListener("click", this.onClick);
    // todo encapsulate window events
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private onClick() {
    this.getSceneManager().switchScene("game");
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
      this.getSceneManager().switchScene("game");
    }
  }
}
