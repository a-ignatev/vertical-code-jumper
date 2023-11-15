import { AnimatedImage } from "engine/components/AnimatedImage";
import { AnimationSet } from "engine/components/AnimationSet";
import { Rect } from "engine/components/Rect";
import { Sound } from "engine/components/Sound";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { PlayerController } from "game/components/PlayerController";
import { LifeBar } from "./LifeBar";

const GRAVITY = 1000;
const JUMP_SPEED = -500;

const DRINKING_PERIOD = 1;
const TRANSFORM_PERIOD = 60;

type GuyForm = "normal" | "strong";
type AnimationName =
  | "falling.normal"
  | "falling.strong"
  | "idle.normal"
  | "idle.strong"
  | "drinking.normal"
  | "drinking.strong"
  | "transforms.normal"
  | "transforms.strong";

export class Guy extends Entity {
  private speedX: number;
  private speedY: number;
  private currentForm: GuyForm;
  private nonDrinkingTimeS: number;
  private lifeTimeS: number;
  private canBecomeStrong: boolean;

  constructor(scene: Scene, cx: number, cy: number, canBecomeStrong: boolean) {
    super(scene);

    this.speedX = 0;
    this.speedY = 0;
    this.getTransform().setPosition(cx, cy);
    this.canBecomeStrong = canBecomeStrong;

    this.addComponent("playerController", PlayerController);

    const animationSet = this.addComponent(
      "animationSet",
      AnimationSet<AnimationName>,
      {
        "falling.normal": new AnimatedImage({
          entity: this,
          spreadsheet: "Normal_Guy_Air.png",
          frames: 1,
          cols: 1,
          width: 15,
          height: 20,
          isBlocking: false,
        }),
        "falling.strong": new AnimatedImage({
          entity: this,
          spreadsheet: "Strong_Guy_Idle_SpriteSheet.png",
          frames: 1,
          cols: 1,
          width: 18,
          height: 23,
          isBlocking: false,
        }),
        "idle.normal": new AnimatedImage({
          entity: this,
          spreadsheet: "Normal_Guy_Idle_SpriteSheet.png",
          frames: 9,
          cols: 3,
          width: 15,
          height: 20,
          isBlocking: false,
        }),
        "idle.strong": new AnimatedImage({
          entity: this,
          spreadsheet: "Strong_Guy_Jumps.png",
          frames: 1,
          cols: 1,
          width: 19,
          height: 21,
          isBlocking: false,
        }),
        "drinking.normal": new AnimatedImage({
          entity: this,
          spreadsheet: "Normal_Guy_Drinks_SpriteSheet.png",
          frames: 11,
          cols: 4,
          width: 15,
          height: 20,
          isBlocking: true,
          onEnd: () => {
            animationSet.setCurrentAnimation("idle.normal");
          },
        }),
        "drinking.strong": null,
        "transforms.normal": new AnimatedImage({
          entity: this,
          spreadsheet: "Normal_Guy_Transforms_SpriteSheet.png",
          frames: 27,
          cols: 5,
          width: 29,
          height: 25,
          isBlocking: true,
          onEnd: () => {
            animationSet.setCurrentAnimation("idle.strong");
            this.currentForm = "strong";
          },
        }),
        "transforms.strong": null,
      },
      "idle.normal"
    );

    this.addComponent("jumpSound", Sound, "jump.mp3");
    const roarSound = this.addComponent("roarSound", Sound, "roar.mp3");
    roarSound.setVolume(0.5);
    const drinkingSound = this.addComponent(
      "drinkingSound",
      Sound,
      "coffee.mp3"
    );
    drinkingSound.setVolume(0.5);
    this.nonDrinkingTimeS = 0;
    this.lifeTimeS = 0;
    this.currentForm = "normal";

    const size = animationSet.getAnimation("idle.normal")?.getSize();

    if (size) {
      const boundingBox = this.addComponent(
        "boundingBox",
        Rect,
        2 * size.width,
        1
      );
      boundingBox.pivot = { x: -size.width, y: size.height };
      const fullBoundingBox = this.addComponent(
        "fullBoundingBox",
        Rect,
        2 * size.width,
        2 * size.height,
        "#00FF00"
      );
      fullBoundingBox.pivot = { x: -size.width, y: -size.width };
    }
  }

  setSpeedX(speed: number) {
    this.speedX = speed;
  }

  getAnimationSet() {
    return this.getComponent<AnimationSet<AnimationName>>("animationSet");
  }

  update({ delta }: Context) {
    const graphics = this.getScene().getSceneManager().getGraphics();
    const animationSet = this.getAnimationSet();
    this.getComponent<PlayerController>("playerController")?.update();

    if (!animationSet) {
      return;
    }

    this.lifeTimeS += delta;

    this.speedY += GRAVITY * delta;
    this.getTransform().translate(this.speedX * delta, this.speedY * delta);
    const { x, y } = this.getTransform().getPosition();
    this.getTransform().setPosition(
      Math.max(
        animationSet.getCurrentAnimation().getSize().width,
        Math.min(
          x,
          graphics.getWidth() -
            animationSet.getCurrentAnimation().getSize().width
        )
      ),
      y
    );

    for (const entity of this.getScene().getEntities()) {
      const otherBoundingBox = entity.getComponent<Rect>("boundingBox");

      if (!otherBoundingBox || entity === this) {
        continue;
      }

      const boundingBox = this.getComponent<Rect>("boundingBox");

      if (
        this.speedY > 0 &&
        boundingBox &&
        boundingBox.intersects(otherBoundingBox)
      ) {
        this.speedY = JUMP_SPEED;
        this.getComponent<Sound>("jumpSound")?.play();
      }
    }

    if (!animationSet.getCurrentAnimation().isBlocking) {
      if (this.speedY > 0) {
        animationSet.setCurrentAnimation(`falling.${this.currentForm}`);
      } else {
        animationSet.setCurrentAnimation(`idle.${this.currentForm}`);
      }

      this.nonDrinkingTimeS += delta;

      if (this.currentForm === "normal") {
        if (
          this.nonDrinkingTimeS >= DRINKING_PERIOD &&
          this.getScene().getEntity("coffeeWave")
        ) {
          this.getComponent<Sound>("drinkingSound")?.playWithDelay(500);
          this.nonDrinkingTimeS = 0;
          animationSet.setCurrentAnimation(`drinking.normal`);
        }

        if (this.canBecomeStrong && this.lifeTimeS >= TRANSFORM_PERIOD) {
          this.getComponent<Sound>("roarSound")?.play();
          animationSet.setCurrentAnimation(`transforms.normal`);
          this.getScene().getEntity<LifeBar>("lifeBar")?.becomeStrong();
        }
      }
    }

    animationSet.update(delta);

    const offTheScreen =
      this.getTransform().getY() -
        2 * animationSet.getCurrentAnimation().getSize().height >
      graphics.getHeight();

    if (offTheScreen) {
      if (
        this.getScene().getSceneManager().getCurrentSceneName() !== "gameOver"
      ) {
        this.getScene().getSceneManager().switchScene("gameOver");
      }
    }
  }

  getZOrder() {
    return 1;
  }
}
