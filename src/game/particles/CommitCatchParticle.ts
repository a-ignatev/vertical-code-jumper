import { Graphics } from "engine/core/Graphics";
import { Particle } from "engine/particles/Particle";

export class CommitCatchParticle implements Particle {
  lifetime: number;
  private position: { x: number; y: number } = { x: 0, y: 0 };
  private velocity: { x: number; y: number };

  constructor() {
    this.lifetime = Math.random();

    this.velocity = {
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
    };
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  update(delta: number) {
    this.lifetime -= delta;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }

  render(graphics: Graphics) {
    graphics.setFillColor("rgba(237, 187, 78, 0.9)");
    graphics.drawCircle(this.position.x, this.position.y, 2);
  }
}
