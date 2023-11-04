import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "./Entity";

const DEFAULT_COLOR = "#ff0000";

export class Rect extends Component implements IRenderable {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private color: string;

  constructor(
    entity: Entity,
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string
  ) {
    super(entity);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color || DEFAULT_COLOR;
  }

  render(graphics: Graphics, debug: boolean) {
    console.log(debug);

    if (!debug) {
      return;
    }

    graphics.setStrokeColor(this.color);
    graphics.strokeRect(this.x, this.y, this.width, this.height);
    graphics.fill();
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  intersects(other: Rect) {
    const rect1Right = this.x + this.width;
    const rect1Bottom = this.y + this.height;
    const rect2Right = other.x + other.width;
    const rect2Bottom = other.y + other.height;

    if (
      rect1Right < other.x ||
      rect2Right < this.x ||
      rect1Bottom < other.y ||
      rect2Bottom < this.y
    ) {
      return false;
    }

    return true;
  }

  destroy() {}
}
