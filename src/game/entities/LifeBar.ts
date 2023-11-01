import { Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Sound } from "engine/sound/Sound";

const LIFE_COUNT = 3;
const WIDTH = 28;
const HEIGHT = 24;
const PADDING = 4;

export class LifeBar extends Entity {
  private heartImg: HTMLImageElement;
  private heartEmptyImg: HTMLImageElement;
  private life = LIFE_COUNT;
  sound: Sound;

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

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const offset = window.innerWidth - (WIDTH + PADDING) * LIFE_COUNT;

    for (let i = 0; i < LIFE_COUNT; i++) {
      ctx.drawImage(
        this.life - 1 >= i ? this.heartImg : this.heartEmptyImg,
        offset + i * (WIDTH + PADDING),
        PADDING,
        WIDTH,
        HEIGHT
      );
    }
  }
}
