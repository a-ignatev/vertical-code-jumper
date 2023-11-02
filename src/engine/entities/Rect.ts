import { Graphics } from "engine/graphics/Graphics";

const DEFAULT_COLOR = "#ff0000";

export class Rect {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color || DEFAULT_COLOR;
  }

  render(graphics: Graphics) {
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
}
