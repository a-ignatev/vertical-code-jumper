import { Context, Entity } from "engine/entities/Entity";
import { Particle } from "engine/particles/Particle";
import { ParticlesSource } from "engine/particles/ParticlesSource";
import { Scene } from "engine/scenes/Scene";

export class ParticlesEmitter<
  T extends new (...args: ConstructorParameters<T>) => Particle
> extends Entity {
  constructor(
    scene: Scene,
    position: { x: number; y: number },
    count: number,
    particleType: T,
    ...parameters: ConstructorParameters<T>
  ) {
    super(scene);

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const particle = new particleType(...parameters);
      particle.setPosition(position.x, position.y);
      particles.push(particle);
    }

    this.addComponent("particles", ParticlesSource, particles);
  }

  update({ delta }: Context) {
    const particles = this.getComponent<ParticlesSource>("particles");

    if (particles) {
      particles.update(delta);

      if (particles.isFinished()) {
        this.getScene().removeEntity(this);
      }
    }
  }
}
