import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { ParticlesEmitter } from "engine/entities/ParticlesEmitter";
import { CommitSplashParticle } from "game/particles/CommitSplashParticle";

export class ColorBox extends Component implements IRenderable {
  private size: number;
  private color: string;

  constructor(entity: Entity, size: number, color: string) {
    super(entity);

    this.size = size;
    this.color = color;
  }

  render(graphics: Graphics): void {
    const { x, y } = this.getWorldPosition();

    graphics.setFillColor(this.color);
    graphics.fillRect(x, y, this.size, this.size);
  }

  spawnCommitSplash() {
    const { x, y } = this.getWorldPosition();

    this.getEntity()
      .getScene()
      .spawnEntity(
        "commitSplash",
        ParticlesEmitter<typeof CommitSplashParticle>,
        { x, y },
        Math.random() * 20 + 10,
        CommitSplashParticle,
        this.color
      );
  }

  destroy() {}
}
