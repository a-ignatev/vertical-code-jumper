import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { CommitSplash } from "game/entities/CommitSplash";

export class ColorBox extends Component implements IRenderable {
  private size: number;
  private color: string;

  constructor(entity: Entity, size: number, color: string) {
    super(entity);

    this.size = size;
    this.color = color;
  }

  render(graphics: Graphics): void {
    const { x, y } = this.getEntity().getTransform().getPosition();

    graphics.setFillColor(this.color);
    graphics.fillRect(x + this.pivot.x, y + this.pivot.y, this.size, this.size);
  }

  spawnCommitSplash() {
    const { x, y } = this.getEntity().getTransform().getPosition();
    this.getEntity()
      .getScene()
      .spawnEntity("commitSplash", CommitSplash, this.color, {
        x: x + this.pivot.x,
        y: y + this.pivot.y,
      });
  }

  destroy() {}
}
