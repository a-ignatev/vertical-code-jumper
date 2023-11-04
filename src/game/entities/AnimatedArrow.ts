import { Text } from "engine/components/Text";
import { Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

type Direction = "left" | "right";

export class AnimatedArrow extends Entity {
  private font = `${globalFontSize * 3}px ${globalFontFamily.split(",")[0]}`;

  private direction: Direction;
  private side: Direction;
  private isGrowing: boolean = true;
  private scale: number = 1;
  private originalTextWidth: number;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    direction: "left" | "right",
    side: "left" | "right"
  ) {
    super(scene);

    this.direction = direction;
    this.side = side;

    this.getTransform().setPosition(x, y);
    const graphics = this.getScene().getSceneManager().getGraphics();
    graphics.setFont(this.font);
    const measure = graphics.measureText("←");
    this.originalTextWidth = measure.width;
    const height =
      measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
    const shift = (this.originalTextWidth / 2) * this.scale;

    if (this.direction === "left" && this.side === "left") {
      const leftArrow = this.addComponent("leftArrow", Text, "←");
      leftArrow.pivot = {
        x: -this.originalTextWidth - shift,
        y: height / 2,
      };
      leftArrow.setFont(this.font);
    }

    if (this.direction === "left" && this.side === "right") {
      const leftArrow = this.addComponent("leftArrow", Text, "←");
      leftArrow.pivot = { x: shift, y: height / 2 };
      leftArrow.setFont(this.font);
    }

    if (this.direction === "right" && this.side === "left") {
      const rightArrow = this.addComponent("rightArrow", Text, "→");
      rightArrow.pivot = {
        x: -this.originalTextWidth - shift,
        y: height / 2,
      };
      rightArrow.setFont(this.font);
    }

    if (this.direction === "right" && this.side === "right") {
      const rightArrow = this.addComponent("rightArrow", Text, "→");
      rightArrow.pivot = { x: shift, y: height / 2 };
      rightArrow.setFont(this.font);
    }
  }

  update(): void {
    if (this.isGrowing === true) {
      this.scale -= 0.05;
    } else {
      this.scale += 0.05;
    }

    if (this.scale > 2) {
      this.isGrowing = true;
    }

    if (this.scale < 0.6) {
      this.isGrowing = false;
    }

    const shift = (this.originalTextWidth / 2) * this.scale;

    if (this.direction === "left" && this.side === "left") {
      this.getComponent<Text>("leftArrow")!.pivot.x =
        -this.originalTextWidth - shift;
    }

    if (this.direction === "left" && this.side === "right") {
      this.getComponent<Text>("leftArrow")!.pivot.x = shift;
    }

    if (this.direction === "right" && this.side === "left") {
      this.getComponent<Text>("rightArrow")!.pivot.x =
        -this.originalTextWidth - shift;
    }

    if (this.direction === "right" && this.side === "right") {
      this.getComponent<Text>("rightArrow")!.pivot.x = shift;
    }
  }
}
