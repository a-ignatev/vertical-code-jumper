import { Component } from "engine/components/Component";
import { IRenderable } from "engine/components/IRenderable";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { Particle } from "./Particle";

export class ParticlesSource extends Component implements IRenderable {
  private particles: Particle[] = [];

  constructor(entity: Entity, particles: Particle[]) {
    super(entity);

    this.particles = particles;
  }

  update(delta: number) {
    this.particles.forEach((particle) => {
      particle.update(delta);
    });

    this.particles = this.particles.filter((particle) => particle.lifetime > 0);
  }

  isFinished() {
    return this.particles.length === 0;
  }

  render(graphics: Graphics) {
    this.particles.forEach((particle) => {
      particle.render(graphics);
    });
  }

  destroy() {}
}
