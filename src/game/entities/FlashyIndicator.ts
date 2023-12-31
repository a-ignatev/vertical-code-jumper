import { Text } from "engine/components/Text";
import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

const SCALE_SPEED = 3;
const MAX_SCALE = 2;
const MIN_SCALE = 0.6;

export class FlashyIndicator extends Entity {
  private isGrowing: boolean = true;
  private scale: number = 1;
  private originalTextWidth: number = 0;
  private top = -100;

  constructor(scene: Scene, message: string, color: string) {
    super(scene);

    const text = this.addComponent("text", Text, message);
    this.originalTextWidth = text.getWidth();
    text.setColor(color);
  }

  update({ delta }: Context): void {
    if (this.isGrowing) {
      this.scale -= SCALE_SPEED * delta;
    } else {
      this.scale += SCALE_SPEED * delta;
    }

    if (this.scale > MAX_SCALE) {
      this.isGrowing = true;
    }

    if (this.scale < MIN_SCALE) {
      this.isGrowing = false;
    }

    const graphics = this.getScene().getSceneManager().getGraphics();
    this.getTransform().setPosition(
      graphics.getWidth() / 2 - (this.originalTextWidth / 2) * this.scale,
      this.top
    );
    this.getComponent<Text>("text")?.setFont(
      `${globalFontSize * this.scale}px ${globalFontFamily.split(",")[0]}`
    );
  }

  setIsHidden(value: boolean) {
    this.top = value ? -100 : 20;
  }
}
