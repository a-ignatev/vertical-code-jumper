import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { Component } from "./Component";
import { IRenderable } from "./IRenderable";

const FRAME_TIME = 1 / 8; // 8fps

interface ImageProperties {
  framesCount: number;
  cols: number;
  width: number;
  height: number;
}

export class AnimatedImage extends Component implements IRenderable {
  public isBlocking: boolean;

  private currentFrame = 0;
  private elapsedTime = 0;
  private img: HTMLImageElement;
  private onEnd?: () => void;
  private imageProperties: ImageProperties;

  constructor({
    entity,
    spreadsheet,
    frames,
    cols,
    width,
    height,
    isBlocking,
    onEnd,
  }: {
    entity: Entity;
    spreadsheet: string;
    frames: number;
    cols: number;
    width: number;
    height: number;
    isBlocking: boolean;
    onEnd?: () => void;
  }) {
    super(entity);

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

  render(graphics: Graphics) {
    const { x: cx, y: cy } = this.getEntity().getTransform().getPosition();
    const row = Math.trunc(this.currentFrame / this.imageProperties.cols);
    const col = this.currentFrame % this.imageProperties.cols;

    graphics.drawImage(
      this.img,
      col * this.imageProperties.width,
      row * this.imageProperties.height,
      this.imageProperties.width,
      this.imageProperties.height,
      cx + this.pivot.x - this.imageProperties.width,
      cy + this.pivot.y - this.imageProperties.height,
      2 * this.imageProperties.width,
      2 * this.imageProperties.height
    );
  }

  destroy() {
    this.img.remove();
  }
}
