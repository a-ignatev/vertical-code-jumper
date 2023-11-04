import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";

const DEFAULT_COLOR = "#ff0000";

export class Rect extends Component implements IRenderable {
  private width: number;
  private height: number;
  private color: string;

  constructor(entity: Entity, width: number, height: number, color?: string) {
    super(entity);

    this.width = width;
    this.height = height;
    this.color = color || DEFAULT_COLOR;
  }

  getWidth() {
    return this.width;
  }

  render(graphics: Graphics, debug: boolean) {
    if (!debug) {
      return;
    }

    const { x, y } = this.getEntity().getTransform().getPosition();
    graphics.setStrokeColor(this.color);
    graphics.strokeRect(
      x + this.pivot.x,
      y + this.pivot.y,
      this.width,
      this.height
    );
  }

  intersects(other: Rect) {
    const { x, y } = this.getEntity().getTransform().getPosition();
    const { x: otherX, y: otherY } = other
      .getEntity()
      .getTransform()
      .getPosition();

    const rect1Right = x + this.pivot.x + this.width;
    const rect1Bottom = y + this.pivot.y + this.height;
    const rect2Right = otherX + other.pivot.x + other.width;
    const rect2Bottom = otherY + other.pivot.y + other.height;

    if (
      rect1Right < otherX + other.pivot.x ||
      rect2Right < x + this.pivot.x ||
      rect1Bottom < otherY + other.pivot.y ||
      rect2Bottom < y + this.pivot.y
    ) {
      return false;
    }

    return true;
  }

  destroy() {}
}
