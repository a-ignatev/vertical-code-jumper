import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { CommitCatchParticle } from "game/components/particles/CommitCatchParticle";
import { Particle } from "game/components/particles/Particle";
import { ParticlesSource } from "game/components/particles/ParticlesSource";

export class CommitCatch extends Entity {
  constructor(scene: Scene, position: { x: number; y: number }) {
    super(scene);

    this.getTransform().setPosition(position.x, position.y);

    const particles: Particle[] = [];
    const count = Math.random() * 50 + 10;
    for (let i = 0; i < count; i++) {
      particles.push(
        new CommitCatchParticle(this.getTransform().getPosition())
      );
    }
    this.addComponent("commitCatchParticles", ParticlesSource, particles);
  }

  update({ delta }: Context) {
    const particles = this.getComponent<ParticlesSource>(
      "commitCatchParticles"
    );

    if (particles) {
      particles.update(delta);

      if (particles.isFinished()) {
        this.getScene().removeEntity(this);
      }
    }
  }
}
