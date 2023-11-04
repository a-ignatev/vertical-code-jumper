import { Sound } from "engine/components/Sound";
import { StaticImage } from "engine/components/StaticImage";
import { Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

const LIFE_COUNT = 3;
const STRONG_LIFE_COUNT = 4;
const WIDTH = 28;
const HEIGHT = 24;
const PADDING = 4;

export class LifeBar extends Entity {
  private life = LIFE_COUNT;
  private totalLife = LIFE_COUNT;

  constructor(scene: Scene) {
    super(scene);

    this.addComponent("hurtSound", Sound, "ough.mp3");
    this.updateHealthBar();
  }

  private setLife(value: number) {
    this.life = value;
    this.updateHealthBar();
  }

  private updateHealthBar() {
    for (const component of this.getComponents()) {
      if (component instanceof StaticImage) {
        this.removeComponent(component);
      }
    }

    const graphics = this.getScene().getSceneManager().getGraphics();
    const offset = graphics.getWidth() - (WIDTH + PADDING) * this.totalLife;
    for (let i = 0; i < this.totalLife; i++) {
      this.addHeart(this.life - 1 >= i ? "heart.png" : "heart-empty.png", {
        x: offset + i * (WIDTH + PADDING),
        y: PADDING,
      });
    }
  }

  private addHeart(filename: string, offset: { x: number; y: number }) {
    const heart = this.addComponent(
      "fullHeart",
      StaticImage,
      filename,
      WIDTH,
      HEIGHT
    );
    heart.pivot = offset;
  }

  decreaseLife() {
    this.setLife(this.life - 1);

    if (this.life <= 0) {
      if (
        this.getScene().getSceneManager().getCurrentSceneName() !== "gameOver"
      ) {
        this.getScene().getSceneManager().switchScene("gameOver");
      }
    } else {
      this.getComponent<Sound>("hurtSound")?.play();
    }
  }

  increaseLife() {
    if (this.life !== this.totalLife) {
      this.setLife(this.life + 1);
    }
  }

  reset() {
    this.setLife(this.totalLife);
  }

  becomeStrong() {
    this.totalLife = STRONG_LIFE_COUNT;
    this.reset();
  }

  update(): void {}
}
