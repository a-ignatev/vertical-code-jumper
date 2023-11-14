import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";
import { CommitSplashParticle } from "game/components/particles/CommitSplashParticle";
import { Particle } from "game/components/particles/Particle";
import { ParticlesSource } from "game/components/particles/ParticlesSource";

export class CommitSplash extends Entity {
  constructor(scene: Scene, color: string, position: { x: number; y: number }) {
    super(scene);

    this.getTransform().setPosition(position.x, position.y);

    const particles: Particle[] = [];
    const count = Math.random() * 20 + 10;
    for (let i = 0; i < count; i++) {
      particles.push(
        new CommitSplashParticle(this.getTransform().getPosition(), color)
      );
    }
    this.addComponent("commitFlashParticles", ParticlesSource, particles);
  }

  update({ delta }: Context) {
    const particles = this.getComponent<ParticlesSource>(
      "commitFlashParticles"
    );

    if (particles) {
      particles.update(delta);

      if (particles.isFinished()) {
        this.getScene().removeEntity(this);
      }
    }
  }
}
