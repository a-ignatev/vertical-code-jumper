import { Word } from "../entities/Word";
import { Guy, SIDE_SPEED } from "../entities/Guy";
import { WordSpawner } from "../entities/WordSpawner";
import { LEFT_KEY, RIGHT_KEY } from "../main";
import { Scene } from "../../engine/scenes/Scene";
import { Score } from "../entities/Score";
import { Entity } from "../../engine/entities/Entity";

export class Game extends Scene {
  words: string[];
  holdingKeys: string[] = [];
  guy?: Guy;
  score?: Score;

  constructor(words: string[]) {
    super();

    this.words = words;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    this.setEntities(this.initEntities(this.words));

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  detach() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    return { score: this.score?.getScore() };
  }

  private initEntities(words: string[]) {
    let entities: Entity[] = [];
    this.guy = new Guy(window.innerWidth / 2, 0, true);
    this.score = new Score("Score: ", globalFontSize / 2, 1.5 * globalFontSize);
    entities.push(this.guy);
    entities.push(this.score);
    entities.push(new WordSpawner(words));

    // TODO refactor
    // create initial words
    let y = 1;
    while (y * 100 <= window.innerHeight) {
      const randomWord = Word.randomWord(words);
      randomWord.y = y * 100;
      entities.push(randomWord);
      y++;
    }

    return entities;
  }

  private onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.guy) {
      return;
    }

    if (event.key === LEFT_KEY) {
      this.guy.speedX = -SIDE_SPEED;
      this.holdingKeys.push(event.key);
    }

    if (event.key === RIGHT_KEY) {
      this.guy.speedX = SIDE_SPEED;
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
        this.guy.speedX = 0;
      }
    }
  }
}
