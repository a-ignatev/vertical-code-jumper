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

    const { x, y } = this.getWorldPosition();
    graphics.setStrokeColor(this.color);
    graphics.strokeRect(x, y, this.width, this.height);
  }

  intersects(other: Rect) {
    const { x, y } = this.getWorldPosition();
    const { x: otherX, y: otherY } = other.getWorldPosition();

    const rect1Right = x + this.width;
    const rect1Bottom = y + this.height;
    const rect2Right = otherX + other.width;
    const rect2Bottom = otherY + other.height;

    if (
      rect1Right < otherX ||
      rect2Right < x ||
      rect1Bottom < otherY ||
      rect2Bottom < y
    ) {
      return false;
    }

    return true;
  }

  approximateIntersectionPoint(other: Rect) {
    const { x, y } = this.getWorldPosition();
    const { x: otherX, y: otherY } = other.getWorldPosition();

    const rect1Right = x + this.width;
    const rect1Bottom = y + this.height;
    const rect2Right = otherX + other.width;
    const rect2Bottom = otherY + other.height;

    const left = Math.max(x, otherX);
    const top = Math.max(y, otherY);
    const right = Math.min(rect1Right, rect2Right);
    const bottom = Math.min(rect1Bottom, rect2Bottom);

    return {
      x: (left + right) / 2,
      y: (top + bottom) / 2,
    };
  }

  destroy() {}
}
