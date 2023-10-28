const FRAME_TIME = 1000 / 8; // 8fps

export class Animation {
  spreadsheet: string;
  currentFrame = 0;
  elapsedTime = 0;
  img: HTMLImageElement;
  framesCount: number;
  cols: number;
  onEnd?: () => void;
  blocking: boolean;
  width: number;
  height: number;

  constructor({
    spreadsheet,
    frames,
    cols,
    width,
    height,
    blocking,
    onEnd,
  }: {
    spreadsheet: string;
    frames: number;
    cols: number;
    width: number;
    height: number;
    blocking: boolean;
    onEnd?: () => void;
  }) {
    this.spreadsheet = spreadsheet;
    this.img = new Image(); // Create new img element
    this.img.src = imgFolder + "/" + spreadsheet; // Set source path
    this.framesCount = frames;
    this.cols = cols;
    this.blocking = blocking;
    this.onEnd = onEnd;
    this.width = width;
    this.height = height;
  }

  update(delta: number) {
    this.elapsedTime += delta;

    if (this.elapsedTime >= FRAME_TIME) {
      this.elapsedTime = 0;

      if (this.currentFrame + 1 >= this.framesCount) {
        this.currentFrame = 0;
        this.onEnd?.();
      } else {
        this.currentFrame++;
      }
    }
  }

  render(cx: number, cy: number, ctx: CanvasRenderingContext2D) {
    const row = Math.trunc(this.currentFrame / this.cols);
    const col = this.currentFrame % this.cols;

    ctx.drawImage(
      this.img,
      col * this.width,
      row * this.height,
      this.width,
      this.height,
      cx - this.width,
      cy - this.height,
      2 * this.width,
      2 * this.height
    );
  }
}
