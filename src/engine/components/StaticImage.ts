import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { Component } from "./Component";
import { IRenderable } from "./IRenderable";

export class StaticImage extends Component implements IRenderable {
  private img: HTMLImageElement;
  private width: number;
  private height: number;

  constructor(
    entity: Entity,
    imageName: string,
    width: number,
    height: number
  ) {
    super(entity);

    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = mediaFolder + "/img/" + imageName;
  }

  render(graphics: Graphics): void {
    const { x, y } = this.getEntity().getTransform().getPosition();

    graphics.drawImage(
      this.img,
      x + this.pivot.x,
      y + this.pivot.y,
      this.width,
      this.height
    );
  }

  destroy(): void {
    this.img.remove();
  }
}
