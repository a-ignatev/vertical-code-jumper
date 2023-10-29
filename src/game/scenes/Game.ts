import { Scene } from "engine/scenes/Scene";
import { CommitSpawner } from "game/entities/CommitSpawner";
import { Guy, SIDE_SPEED } from "game/entities/Guy";
import { Score } from "game/entities/Score";
import { Word } from "game/entities/Word";
import { WordSpawner } from "game/entities/WordSpawner";

const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";

export class Game extends Scene {
  private words: string[];
  private holdingKeys: string[] = [];
  private guy?: Guy;
  private score?: Score;

  constructor(words: string[]) {
    super();

    this.words = words;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach(ctx: CanvasRenderingContext2D) {
    this.guy = new Guy(window.innerWidth / 2, 0, true);
    this.score = new Score(
      "Score: ",
      globalFontSize / 2,
      1.5 * globalFontSize,
      ctx
    );

    // TODO refactor
    // create initial words
    let y = 1;
    while (y * 100 <= window.innerHeight) {
      const randomWord = Word.randomWord(this.words, innerWidth / 2, ctx);
      randomWord.y = y * 100;
      this.addEntity("word", randomWord);
      y++;
    }

    this.addEntity("guy", this.guy);
    this.addEntity("score", this.score);
    this.addEntity("wordSpawner", new WordSpawner(this.words, ctx));
    this.addEntity("commitSpawner", new CommitSpawner(ctx));

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  detach() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    return { score: this.score?.getScore() };
  }

  private onKeyDown(event: KeyboardEvent) {
    event.preventDefault();

    if (!this.guy) {
      return;
    }

    if (event.key === LEFT_KEY) {
      this.guy.setSpeedX(-SIDE_SPEED);
      this.holdingKeys.push(event.key);
    }

    if (event.key === RIGHT_KEY) {
      this.guy.setSpeedX(SIDE_SPEED);
      this.holdingKeys.push(event.key);
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    event.preventDefault();

    if (!this.guy) {
      return;
    }

    if (event.key === LEFT_KEY || event.key === RIGHT_KEY) {
      this.holdingKeys = this.holdingKeys.filter((key) => key !== event.key);

      if (!this.holdingKeys.length) {
        this.guy.setSpeedX(0);
      }
    }
  }
}
