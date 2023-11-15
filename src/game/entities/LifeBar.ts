import { Sound } from "engine/components/Sound";
import { StaticImage } from "engine/components/StaticImage";
import { Entity } from "engine/entities/Entity";
import { ParticlesEmitter } from "engine/entities/ParticlesEmitter";
import { Scene } from "engine/scenes/Scene";
import { Hearts } from "game/particles/Hearts";

const LIFE_COUNT = 3;
const STRONG_LIFE_COUNT = 4;
const WIDTH = 28;
const HEIGHT = 24;
const PADDING = 4;

export class LifeBar extends Entity {
  private life = LIFE_COUNT;
  private totalLife = LIFE_COUNT;
  private lastFullHeartInRow: StaticImage | null = null;

  constructor(scene: Scene) {
    super(scene);

    const hurtSound = this.addComponent("hurtSound", Sound, "ough.mp3");
    hurtSound.setVolume(0.5);
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

    this.lastFullHeartInRow = null;

    const graphics = this.getScene().getSceneManager().getGraphics();
    const offset = graphics.getWidth() - (WIDTH + PADDING) * this.totalLife;
    for (let i = 0; i < this.totalLife; i++) {
      const isFullHeart = this.life - 1 >= i;

      const heart = this.addHeart(
        isFullHeart ? "heart.png" : "heart-empty.png",
        {
          x: offset + i * (WIDTH + PADDING),
          y: PADDING,
        }
      );

      if (isFullHeart) {
        this.lastFullHeartInRow = heart;
      }
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

    return heart;
  }

  decreaseLife() {
    if (this.lastFullHeartInRow) {
      this.getScene().spawnEntity(
        "hurtParticles",
        ParticlesEmitter,
        {
          x: this.lastFullHeartInRow.getWorldPosition().x + WIDTH / 2,
          y: this.lastFullHeartInRow.getWorldPosition().y + WIDTH / 2,
        },
        10,
        Hearts
      );
    }

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
