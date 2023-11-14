import { Sound } from "engine/components/Sound";
import { Text } from "engine/components/Text";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

export const SCORE_COLOR = "#EDBB4E";

export class Score extends Entity {
  private playTimeS: number = 0;
  private additionalScore: number = 0;

  constructor(scene: Scene) {
    super(scene);

    this.getTransform().setPosition(globalFontSize / 2, 1.5 * globalFontSize);
    const text = this.addComponent("text", Text, "Score:");
    text.setColor(SCORE_COLOR);
    this.addComponent("scoreSound", Sound, "score.mp3");
  }

  update({ delta }: Context) {
    this.playTimeS += delta;

    const score = this.getScore();

    this.getComponent<Text>("text")?.setText("Score: " + score.toString());
  }

  addScore(value: number) {
    this.additionalScore += value;
    this.getComponent<Sound>("scoreSound")?.play();
  }

  getScore() {
    return Math.round(this.playTimeS) * 10 + this.additionalScore;
  }
}
