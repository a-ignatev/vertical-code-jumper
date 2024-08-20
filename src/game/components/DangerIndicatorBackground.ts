import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";

export class DangerIndicatorBackground
  extends Component
  implements IRenderable
{
  private height: number;
  private width: number;
  private factor: number;

  constructor(entity: Entity) {
    super(entity);

    const graphics = this.getEntity()
      .getScene()
      .getSceneManager()
      .getGraphics();

    this.height = graphics.getHeight();
    this.width = graphics.getWidth();
    this.factor = 0;
  }

  setDangerLevelFactor(factor: number) {
    this.factor = factor;
  }

  render(graphics: Graphics): void {
    graphics.setFillColor(`rgba(255, 0, 0, ${this.factor})`);
    graphics.fillRect(0, 0, this.width, this.height);
  }

  destroy(): void {}
}
