import { Context } from "../../engine/entities/Entity";
import { Sound } from "../../engine/sound/Sound";
import { Word } from "./Word";

const TIME_TO_POINTS_RATIO = 1000; // 1s = 10 points
const EFFECT_POINTS = 100; //sound per each 1000
export const SCORE_COLOR = "#EDBB4E";

export class Score extends Word {
  originalWord: string;
  playTime: number = 0;
  scoreSound: Sound;
  lastEffectScore: number = 0;

  constructor(word: string, x: number, y: number) {
    super(word, x, y);

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

  getScore() {
    return Math.round(this.playTime / TIME_TO_POINTS_RATIO) * 10;
  }
}
