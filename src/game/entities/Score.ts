import { Context } from "./Entity";
import { Word } from "./Word";

const TIME_TO_POINTS_RATIO = 1000; // 1s = 10 points
export const SCORE_COLOR = "#EDBB4E";

export class Score extends Word {
  originalWord: string;
  playTime: number = 0;

  constructor(word: string, x: number, y: number) {
    super(word, x, y);

    this.originalWord = word;
    this.color = SCORE_COLOR;
  }

  update({ delta }: Context) {
    this.playTime += delta;
    this.word = this.originalWord + this.getScore().toString();
  }

  getScore() {
    return Math.round(this.playTime / TIME_TO_POINTS_RATIO) * 10;
  }
}
