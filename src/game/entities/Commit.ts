import { Rect } from "engine/components/Rect";
import { Sound } from "engine/components/Sound";
import { Text } from "engine/components/Text";
import { Context, Entity } from "engine/entities/Entity";
import { SoundEmitter } from "engine/entities/SoundEmitter";
import { Scene } from "engine/scenes/Scene";
import { ColorBox } from "game/components/ColorBox";
import { getRandomWordX } from "game/helpers";
import { CoffeeWave } from "./CoffeeWave";
import { CommitCatch } from "./CommitCatch";
import { Guy } from "./Guy";
import { LifeBar } from "./LifeBar";
import { Score } from "./Score";

const FALLING_SPEED = 200;
const FONT_SIZE = globalFontSize * 0.8;
const BLOCK_SIZE = FONT_SIZE * 0.5;
const PADDING = 1;

export class Commit extends Entity {
  private addColor = "#3fb950";
  private removeColor = "#f85149";
  private neutralColor = "#6e768166";

  constructor(scene: Scene) {
    super(scene);

    const graphics = this.getScene().getSceneManager().getGraphics();

    const added = Math.round(Math.random() * 600);
    const removed = Math.round(Math.random() * 500);
    const neutral = Math.round(Math.random() * 200);
    const total = added + removed + neutral;
    const block = Math.round(total / 5);

    const addedString = `+${added} `;
    const removedString = `-${removed} `;

    const font = `${FONT_SIZE}px ${globalFontFamily.split(",")[0]}`;

    const addedText = this.addComponent("addedText", Text, addedString);
    addedText.setFont(font);

    const removedText = this.addComponent("removedText", Text, removedString);
    removedText.setFont(font);
    removedText.pivot.x = addedText.getWidth();

    const blocks = [
      ...Array(Math.round(added / block)).fill(this.addColor),
      ...Array(Math.round(removed / block)).fill(this.removeColor),
      ...Array(Math.round(neutral / block)).fill(this.neutralColor),
    ].slice(0, 5);

    for (let i = 0; i < blocks.length; i++) {
      const box = this.addComponent("box", ColorBox, BLOCK_SIZE, blocks[i]);
      box.pivot = {
        x: addedText.getWidth() + removedText.getWidth() + BLOCK_SIZE * i + 1,
        y: -addedText.getHeight() / 2 - BLOCK_SIZE / 2,
      };
    }

    const totalLength =
      addedText.getWidth() +
      removedText.getWidth() +
      BLOCK_SIZE * 5 +
      PADDING * 5;

    const boundingBox = this.addComponent(
      "collisionBox",
      Rect,
      totalLength,
      FONT_SIZE,
      "#00ff00"
    );
    boundingBox.pivot.y = -FONT_SIZE;

    const randomX = getRandomWordX(graphics);
    this.getTransform().setPosition(
      Math.min(
        Math.max(randomX, 5),
        // start of the word should be that the word would fit the screen
        graphics.getWidth() - this.getWidth()! - 5
      ),
      0
    );
    const shatterSound = this.addComponent(
      "shatterSound",
      Sound,
      "shatter.mp3"
    );
    shatterSound.setVolume(0.5);
  }

  getWidth() {
    return this.getComponent<Rect>("collisionBox")?.getWidth();
  }

  update({ delta }: Context): void {
    this.getTransform().translate(0, FALLING_SPEED * delta);

    const score = this.getScene().getEntity<Score>("score");

    if (score) {
      const guy = this.getScene().getEntity<Guy>("guy");
      const guyBox = guy?.getComponent<Rect>("fullBoundingBox");
      const boundingBox = this.getComponent<Rect>("collisionBox");

      if (guyBox && boundingBox && boundingBox.intersects(guyBox)) {
        const coffeeWave = this.getScene().getEntity<CoffeeWave>("coffeeWave");

        if (coffeeWave) {
          score.addScore(200);
        } else {
          score.addScore(100);
        }
        this.getScene().getEntity<LifeBar>("lifeBar")?.increaseLife();
        this.getScene().spawnEntity(
          "commitCatch",
          CommitCatch,
          boundingBox.approximateIntersectionPoint(guyBox)
        );
        this.getScene().removeEntity(this);
      }
    }

    const graphics = this.getScene().getSceneManager().getGraphics();

    if (this.getTransform().getY() - FONT_SIZE > graphics.getHeight()) {
      for (const component of this.getComponents()) {
        if (component instanceof ColorBox) {
          component.spawnCommitSplash();
        }
      }
      this.getScene().removeEntity(this);

      const shatterSound = this.getScene().spawnEntity(
        "shatterSound",
        SoundEmitter,
        "shatter.mp3",
        0.5
      );
      shatterSound.play(() => {
        this.getScene().removeEntity(shatterSound);
      });

      const coffeeWave = this.getScene().getEntity("coffeeWave");

      if (!coffeeWave) {
        this.getScene().getEntity<LifeBar>("lifeBar")?.decreaseLife();
      }
    }
  }

  getZOrder(): number {
    return 2;
  }
}
