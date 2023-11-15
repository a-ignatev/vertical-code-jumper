import { Graphics } from "engine/core/Graphics";
import { MusicEmitter } from "engine/entities/MusicEmitter";
import { Scene } from "engine/scenes/Scene";
import { SceneManager } from "engine/scenes/SceneManager";
import { CoffeeMug } from "game/entities/CoffeeMug";
import { Commit } from "game/entities/Commit";
import { FallingWord } from "game/entities/FallingWord";
import { FlashyIndicator } from "game/entities/FlashyIndicator";
import { Guy } from "game/entities/Guy";
import { LifeBar } from "game/entities/LifeBar";
import { MovingWord } from "game/entities/MovingWord";
import { Score } from "game/entities/Score";
import { Timer } from "game/entities/Timer";
import { getRandomWordXNotCloseTo } from "game/helpers";

export class Game extends Scene {
  private words: string[];
  private isMusicEnabled: boolean;

  constructor(
    sceneManager: SceneManager,
    words: string[],
    isMusicEnabled: boolean
  ) {
    super(sceneManager);

    this.words = words;
    this.isMusicEnabled = isMusicEnabled;
  }

  switchMusic(enabled: boolean) {
    this.isMusicEnabled = enabled;
    this.getEntity<MusicEmitter>("music")?.switchMusic(enabled);
  }

  setWords(words: string[]) {
    this.words = words;
  }

  attach(graphics: Graphics) {
    // TODO refactor
    // create initial words
    let y = 1;
    while (y * 100 <= graphics.getHeight()) {
      const randomWord = this.spawnEntity("word", FallingWord, this.words);
      randomWord.randomize(graphics.getWidth() / 2);
      randomWord.getTransform().translate(0, y * 100);
      y++;
    }

    const music = this.spawnEntity("music", MusicEmitter, "music.mp3", 0.5);
    music.switchMusic(this.isMusicEnabled);
    const guy = this.spawnEntity("guy", Guy, graphics.getWidth() / 2, 0, true);
    this.spawnEntity("score", Score);
    this.spawnEntity("wordSpawner", Timer, 1, true, () => {
      if (Math.random() > 0.6) {
        const fallingWord = this.spawnEntity(
          "fallingWord",
          FallingWord,
          this.words
        );
        fallingWord.randomize(guy.getTransform().getPosition().x);
      } else {
        const fallingWord = this.spawnEntity(
          "fallingWord",
          MovingWord,
          this.words
        );
        fallingWord.randomize(guy.getTransform().getPosition().x);
      }
    });
    this.spawnEntity("commitSpawner", Timer, 2.5, false, () => {
      const commit = this.spawnEntity("commit", Commit);
      const randomX = getRandomWordXNotCloseTo(
        graphics,
        guy.getTransform().getPosition().x
      );
      commit.getTransform().setPosition(
        Math.min(
          Math.max(randomX, 5),
          // start of the word should be that the word would fit the screen
          graphics.getWidth() - commit.getWidth()! - 5
        ),
        0
      );
    });
    this.spawnEntity("coffeeMugSpawner", Timer, 6, false, () => {
      if (!this.getEntity("coffeeWave")) {
        this.spawnEntity("mug", CoffeeMug);
      }
    });
    this.spawnEntity("bonusIndicator", FlashyIndicator, "x2", "#EDBB4E");
    this.spawnEntity("lifeBar", LifeBar);
  }

  detach() {
    return { score: this.getEntity<Score>("score")?.getScore() };
  }
}
