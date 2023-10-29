import { Context } from "engine/entities/Entity";
import { Sound } from "engine/sound/Sound";
import { Word } from "./Word";

const TIME_TO_POINTS_RATIO = 1000;
const EFFECT_POINTS = 100;
export const SCORE_COLOR = "#EDBB4E";

export class Score extends Word {
  originalWord: string;
  playTime: number = 0;
  scoreSound: Sound;
  lastEffectScore: number = 0;
  additionalScore: number = 0;

  constructor(
    word: string,
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D
  ) {
    super(word, x, y, ctx);

    this.originalWord = word;
    this.color = SCORE_COLOR;

    this.scoreSound = new Sound("score.mp3");
  }

  update({ delta }: Context) {
    this.playTime += delta;

    const score = this.getScore();

    if (score !== this.lastEffectScore && score % EFFECT_POINTS === 0) {
      this.lastEffectScore = score;
      this.scoreSound.play();
    }

    this.word = this.originalWord + score.toString();
  }

  addScore(value: number) {
    this.additionalScore += value;
    this.scoreSound.play();
  }

  getScore() {
    return (
      Math.round(this.playTime / TIME_TO_POINTS_RATIO) * 10 +
      this.additionalScore
    );
  }
}
