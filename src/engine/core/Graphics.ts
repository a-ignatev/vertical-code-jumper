export class Graphics {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(
    image: CanvasImageSource,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  drawImage(image: CanvasImageSource, ...args: number[]) {
    if (args.length === 2) {
      const [dx, dy] = args;
      this.ctx.drawImage(image, dx, dy);
    } else if (args.length === 4) {
      const [dx, dy, dw, dh] = args;
      this.ctx.drawImage(image, dx, dy, dw, dh);
    } else if (args.length === 8) {
      const [sx, sy, sw, sh, dx, dy, dw, dh] = args;
      this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  getWidth() {
    return this.ctx.canvas.width;
  }

  getHeight(): number {
    return this.ctx.canvas.height;
  }

  isScreenTooSmall() {
    return this.ctx.canvas.width < 350;
  }

  isScreenTooWide() {
    return this.ctx.canvas.width > 500;
  }

  setStrokeColor(color: string) {
    this.ctx.strokeStyle = color;
  }

  strokeRect(...args: Parameters<CanvasRenderingContext2D["strokeRect"]>) {
    this.ctx.strokeRect(...args);
  }

  fill() {
    this.ctx.fill();
  }

  setFont(font: string) {
    this.ctx.font = font;
  }

  fillText(text: string, x: number, y: number) {
    this.ctx.fillText(text, x, y);
  }

  setFillColor(color: string) {
    this.ctx.fillStyle = color;
  }

  beginPath() {
    this.ctx.beginPath();
  }

  closePath() {
    this.ctx.closePath();
  }

  moveTo(x: number, y: number) {
    this.ctx.moveTo(x, y);
  }

  lineTo(x: number, y: number) {
    this.ctx.lineTo(x, y);
  }

  measureText(text: string) {
    return this.ctx.measureText(text);
  }

  fillRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x, y, width, height);
  }

  addScreenEventListener(name: string, handler: () => void) {
    this.ctx.canvas.addEventListener(name, handler);
  }

  removeScreenEventListener(name: string, handler: () => void) {
    this.ctx.canvas.removeEventListener(name, handler);
  }

  drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
