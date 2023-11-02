import { Graphics } from "engine/graphics/Graphics";
import { Scene } from "engine/scenes/Scene";
import { BonusIndicator } from "game/entities/BonusIndicator";
import { CoffeeMug } from "game/entities/CoffeeMug";
import { Guy, SIDE_SPEED } from "game/entities/Guy";
import { LifeBar } from "game/entities/LifeBar";
import { Score } from "game/entities/Score";
import {
  createCoffeeMugSpawner,
  createCommitSpawner,
  createWordSpawner,
} from "game/entities/Spawner";
import { Word } from "game/entities/Word";

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

  attach(graphics: Graphics) {
    this.guy = new Guy(graphics.getWidth() / 2, 0, true);
    this.score = new Score(
      "Score: ",
      globalFontSize / 2,
      1.5 * globalFontSize,
      graphics
    );

    // TODO refactor
    // create initial words
    let y = 1;
    while (y * 100 <= graphics.getHeight()) {
      const randomWord = Word.randomWord(
        this.words,
        graphics.getWidth() / 2,
        graphics
      );
      randomWord.y = y * 100;
      this.addEntity("word", randomWord);
      y++;
    }

    this.addEntity("guy", this.guy);
    this.addEntity("score", this.score);
    this.addEntity(
      "wordSpawner",
      createWordSpawner(graphics, this.words, this.guy)
    );
    this.addEntity("commitSpawner", createCommitSpawner(graphics, this.guy));
    this.addEntity("coffeeMugSpawner", createCoffeeMugSpawner(graphics));
    this.addEntity("bonusIndicator", new BonusIndicator(graphics));
    this.addEntity("lifeBar", new LifeBar());

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  detach() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    return { score: this.score?.getScore() };
  }

  private onKeyDown(event: KeyboardEvent) {
    if (!this.guy) {
      return;
    }

    if (event.key === LEFT_KEY) {
      this.guy.setSpeedX(-SIDE_SPEED);
      this.holdingKeys.push(event.key);
      event.preventDefault();
    }

    if (event.key === RIGHT_KEY) {
      this.guy.setSpeedX(SIDE_SPEED);
      this.holdingKeys.push(event.key);
      event.preventDefault();
    }

    if (event.key === "m") {
      const graphics = this.getSceneManager().getGraphics();
      this.addEntity("mug", new CoffeeMug(graphics));
      event.preventDefault();
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (!this.guy) {
      return;
    }

    if (event.key === LEFT_KEY || event.key === RIGHT_KEY) {
      event.preventDefault();
      this.holdingKeys = this.holdingKeys.filter((key) => key !== event.key);

      if (!this.holdingKeys.length) {
        this.guy.setSpeedX(0);
      }
    }
  }
}
