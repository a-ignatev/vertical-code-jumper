import { Graphics } from "engine/graphics/Graphics";

const FRAME_TIME = 1 / 8; // 8fps

interface ImageProperties {
  framesCount: number;
  cols: number;
  width: number;
  height: number;
}

export class Animation {
  public isBlocking: boolean;

  private currentFrame = 0;
  private elapsedTime = 0;
  private img: HTMLImageElement;
  private onEnd?: () => void;
  private imageProperties: ImageProperties;

  constructor({
    spreadsheet,
    frames,
    cols,
    width,
    height,
    isBlocking,
    onEnd,
  }: {
    spreadsheet: string;
    frames: number;
    cols: number;
    width: number;
    height: number;
    isBlocking: boolean;
    onEnd?: () => void;
  }) {
    this.img = new Image(); // Create new img element
    this.img.src = mediaFolder + "/img/" + spreadsheet; // Set source path
    this.isBlocking = isBlocking;
    this.onEnd = onEnd;

    this.imageProperties = {
      framesCount: frames,
      cols,
      width,
      height,
    };
  }

  getSize() {
    return {
      width: this.imageProperties.width,
      height: this.imageProperties.height,
    };
  }

  update(delta: number) {
    this.elapsedTime += delta;

    if (this.elapsedTime >= FRAME_TIME) {
      this.elapsedTime = 0;

      if (this.currentFrame + 1 >= this.imageProperties.framesCount) {
        this.currentFrame = 0;
        this.onEnd?.();
      } else {
        this.currentFrame++;
      }
    }
  }

  render(cx: number, cy: number, graphics: Graphics) {
    const row = Math.trunc(this.currentFrame / this.imageProperties.cols);
    const col = this.currentFrame % this.imageProperties.cols;

    graphics.drawImage(
      this.img,
      col * this.imageProperties.width,
      row * this.imageProperties.height,
      this.imageProperties.width,
      this.imageProperties.height,
      cx - this.imageProperties.width,
      cy - this.imageProperties.height,
      2 * this.imageProperties.width,
      2 * this.imageProperties.height
    );
  }
}
