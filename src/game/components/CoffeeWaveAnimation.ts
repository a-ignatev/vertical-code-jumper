import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";

const SEGMENT_LENGTH = 20;
const MIDDLE_WAVE_SPEED = 6.25;
const MIDDLE_WAVE_MAX = 10;
const MIDDLE_WAVE_MIN = -10;
const SHIFT_SPEED = 4;
const SCALE = 5;

export class CoffeeWaveAnimation extends Component implements IRenderable {
  private baseHeight: number = 0;
  private shift: number = 0;
  private drinkingSpeed: number = 0;
  private pouringSpeed: number = 0;
  private isMiddleGoingUp: boolean = true;
  private middleHeight: number = 0;
  private isPouring = true;
  private onAnimationEnd: () => void;

  constructor(entity: Entity, onAnimationEnd: () => void) {
    super(entity);

    this.onAnimationEnd = onAnimationEnd;
    const graphics = this.getEntity()
      .getScene()
      .getSceneManager()
      .getGraphics();

    this.baseHeight = graphics.getHeight();
    this.drinkingSpeed = graphics.getHeight() / 10; // 10 seconds
    this.pouringSpeed = graphics.getHeight(); // 1 second
    this.shift = 0;
  }

  update(delta: number) {
    if (this.isPouring) {
      this.baseHeight -= this.pouringSpeed * delta;
    } else {
      this.baseHeight += this.drinkingSpeed * delta;
    }

    this.shift -= SHIFT_SPEED * delta;

    if (this.isMiddleGoingUp) {
      this.middleHeight -= MIDDLE_WAVE_SPEED * delta;
    } else {
      this.middleHeight += MIDDLE_WAVE_SPEED * delta;
    }

    if (this.middleHeight > MIDDLE_WAVE_MAX) {
      this.isMiddleGoingUp = true;
    }

    if (this.middleHeight < MIDDLE_WAVE_MIN) {
      this.isMiddleGoingUp = false;
    }

    if (this.isPouring && this.baseHeight <= 0) {
      this.isPouring = false;
    } else {
      const graphics = this.getEntity()
        .getScene()
        .getSceneManager()
        .getGraphics();

      if (this.baseHeight >= graphics.getHeight() + SCALE) {
        this.onAnimationEnd();
      }
    }
  }

  render(graphics: Graphics): void {
    graphics.setStrokeColor("#ece0d1");
    this.renderSineWave(graphics, 40, -SCALE, "rgb(236, 224, 209)");
    this.renderSineWave(graphics, 10, this.middleHeight, "rgb(219, 193, 172)");
    this.renderSineWave(graphics, 0, 2 * SCALE, "rgb(99, 72, 50)");
  }

  destroy(): void {}

  private renderSineWave(
    graphics: Graphics,
    phase: number,
    height: number,
    color: string
  ) {
    graphics.setFillColor(color);
    graphics.beginPath();
    graphics.moveTo(graphics.getWidth(), graphics.getHeight());
    graphics.lineTo(0, graphics.getHeight());
    graphics.lineTo(0, this.baseHeight + height);

    let x = 0;
    while (x <= graphics.getWidth()) {
      const y =
        Math.sin(x * SCALE + phase + this.shift) * SCALE +
        this.baseHeight +
        height;
      graphics.lineTo(x, y);
      x += SEGMENT_LENGTH;
    }

    graphics.lineTo(graphics.getWidth(), this.baseHeight + height);
    graphics.closePath();
    graphics.fill();
  }
}
