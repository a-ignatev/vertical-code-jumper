export class Rect {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fill();
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
