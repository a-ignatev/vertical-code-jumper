import { Animation } from "engine/animation/Animation";
import { Context, Entity } from "engine/entities/Entity";
import { Rect } from "engine/entities/Rect";
import { Sound } from "engine/sound/Sound";
import { Score } from "./Score";
import { Word } from "./Word";

const GRAVITY = 60;
const JUMP_SPEED = -130;
const DRINKING_PERIOD = 5_000;
const TRANSFORM_PERIOD = 60_000;
export const SIDE_SPEED = 60;

type GuyForm = "normal" | "strong";
type AnimationType = "idle" | "falling" | "drinking" | "transforms";

export class Guy extends Entity {
  private speedX: number;
  private speedY: number;
  private cx: number;
  private cy: number;
  private animations: Record<AnimationType, Record<GuyForm, Animation | null>>;
  private currentAnimation: AnimationType;
  private jumpSound: Sound;
  private roarSound: Sound;
  private drinkingSound: Sound;
  private currentForm: GuyForm;
  private nonDrinkingTime: number;
  private lifeTime: number;
  private canTransform: boolean;

  constructor(cx: number, cy: number, canTransform: boolean) {
    super();

    this.speedX = 0;
    this.speedY = GRAVITY;
    this.cx = cx;
    this.cy = cy;
    this.canTransform = canTransform;

    this.animations = {
      falling: {
        normal: new Animation({
          spreadsheet: "Normal_Guy_Air.png",
          frames: 1,
          cols: 1,
          width: 15,
          height: 20,
          isBlocking: false,
        }),
        strong: new Animation({
          spreadsheet: "Strong_Guy_Idle_SpriteSheet.png",
          frames: 1,
          cols: 1,
          width: 18,
          height: 23,
          isBlocking: false,
        }),
      },
      idle: {
        normal: new Animation({
          spreadsheet: "Normal_Guy_Idle_SpriteSheet.png",
          frames: 9,
          cols: 3,
          width: 15,
          height: 20,
          isBlocking: false,
        }),
        strong: new Animation({
          spreadsheet: "Strong_Guy_Jumps.png",
          frames: 1,
          cols: 1,
          width: 19,
          height: 21,
          isBlocking: false,
        }),
      },
      drinking: {
        normal: new Animation({
          spreadsheet: "Normal_Guy_Drinks_SpriteSheet.png",
          frames: 11,
          cols: 4,
          width: 15,
          height: 20,
          isBlocking: true,
          onEnd: () => {
            this.currentAnimation = "idle";
          },
        }),
        strong: null,
      },
      transforms: {
        normal: new Animation({
          spreadsheet: "Normal_Guy_Transforms_SpriteSheet.png",
          frames: 27,
          cols: 5,
          width: 29,
          height: 25,
          isBlocking: true,
          onEnd: () => {
            this.currentAnimation = "idle";
            this.currentForm = "strong";
          },
        }),
        strong: null,
      },
    };

    this.jumpSound = new Sound("jump.mp3");
    this.roarSound = new Sound("roar.mp3");
    this.roarSound.setVolume(0.5);
    this.drinkingSound = new Sound("coffee.mp3");
    this.drinkingSound.setVolume(0.5);

    this.nonDrinkingTime = 0;
    this.lifeTime = 0;
    this.currentAnimation = "idle";
    this.currentForm = "normal";
  }

  private getAnimation() {
    return this.animations[this.currentAnimation][this.currentForm]!;
  }

  getPosition() {
    return {
      cx: this.cx,
      cy: this.cy,
    };
  }

  setSpeedX(speed: number) {
    this.speedX = speed;
  }

  update({ delta }: Context) {
    this.lifeTime += delta;
    this.speedY += GRAVITY / delta;
    this.speedY = this.speedY;

    this.cx += this.speedX / delta;
    this.cx = Math.max(
      this.getAnimation().getSize().width,
      Math.min(this.cx, window.innerWidth - this.getAnimation().getSize().width)
    );
    this.cy += this.speedY / delta;

    for (const entity of this.getScene().getEntities()) {
      if (
        entity === this ||
        !(entity instanceof Word) ||
        entity instanceof Score
      ) {
        continue;
      }

      if (
        this.speedY > 0 &&
        this.getBoundingRect().intersects(entity.getBoundingRect())
      ) {
        this.speedY = JUMP_SPEED;
        this.jumpSound.play();
      }
    }

    if (!this.getAnimation().isBlocking) {
      if (this.speedY > GRAVITY / 2) {
        this.currentAnimation = "falling";
      } else {
        this.currentAnimation = "idle";
      }

      this.nonDrinkingTime += delta;

      if (
        this.currentForm === "normal" &&
        this.nonDrinkingTime >= DRINKING_PERIOD
      ) {
        this.drinkingSound.playWithDelay(500);
        this.nonDrinkingTime = 0;
        this.currentAnimation = "drinking";
      }

      if (
        this.currentForm === "normal" &&
        this.canTransform &&
        this.lifeTime >= TRANSFORM_PERIOD
      ) {
        this.roarSound.play();
        this.currentAnimation = "transforms";
      }
    }

    this.getAnimation().update(delta);

    const offTheScreen =
      this.cy - 2 * this.getAnimation().getSize().height > window.innerHeight;

    if (offTheScreen) {
      this.getScene().getSceneManager().switchScene("gameOver");
    }
  }

  render(ctx: CanvasRenderingContext2D, debug: boolean) {
    this.getAnimation().render(this.cx, this.cy, ctx);

    if (debug) {
      this.getBoundingRect().render(ctx);
    }
  }

  getBoundingRect(): Rect {
    const size = this.getAnimation().getSize();

    return new Rect(
      this.cx - size.width,
      this.cy + size.height - 1,
      2 * size.width,
      1
    );
  }

  getZOrder() {
    return 1;
  }
}
