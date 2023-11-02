import { Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Graphics } from "engine/graphics/Graphics";
import { Sound } from "engine/sound/Sound";

const LIFE_COUNT = 3;
const STRONG_LIFE_COUNT = 4;
const WIDTH = 28;
const HEIGHT = 24;
const PADDING = 4;

export class LifeBar extends Entity {
  private heartImg: HTMLImageElement;
  private heartEmptyImg: HTMLImageElement;
  private life = LIFE_COUNT;
  private totalLife = LIFE_COUNT;
  private sound: Sound;

  constructor() {
    super();

    this.heartImg = new Image();
    this.heartImg.src = mediaFolder + "/img/heart.png";
    this.heartEmptyImg = new Image();
    this.heartEmptyImg.src = mediaFolder + "/img/heart-empty.png";
    this.sound = new Sound("ough.mp3");
  }

  getBoundingRect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  decreaseLife() {
    this.life--;

    if (this.life <= 0) {
      this.getScene().getSceneManager().switchScene("gameOver");
    } else {
      this.sound.play();
    }
  }

  increaseLife() {
    if (this.life !== this.totalLife) {
      this.life++;
    }
  }

  reset() {
    this.life = this.totalLife;
  }

  becomeStrong() {
    this.totalLife = STRONG_LIFE_COUNT;
    this.reset();
  }

  update(): void {}

  render(graphics: Graphics): void {
    const offset = graphics.getWidth() - (WIDTH + PADDING) * this.totalLife;

    for (let i = 0; i < this.totalLife; i++) {
      graphics.drawImage(
        this.life - 1 >= i ? this.heartImg : this.heartEmptyImg,
        offset + i * (WIDTH + PADDING),
        PADDING,
        WIDTH,
        HEIGHT
      );
    }
  }
}
