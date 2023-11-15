import { Graphics } from "engine/core/Graphics";
import { Particle } from "engine/particles/Particle";
import { hexToRgb } from "game/helpers";

export class CommitSplashParticle implements Particle {
  lifetime: number;
  private position: { x: number; y: number } = { x: 0, y: 0 };
  private velocity: number;
  private colorsParts: { r: number; g: number; b: number };

  constructor(color: string) {
    this.lifetime = Math.random() * 3 + 1;

    this.colorsParts = hexToRgb(color) || { r: 0, g: 0, b: 0 };
    this.velocity = -Math.random() * 180 - 20;
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  update(delta: number) {
    this.lifetime -= delta;

    this.position.y += this.velocity * delta;
    this.velocity = this.velocity - this.velocity * 0.7 * delta;
  }

  render(graphics: Graphics) {
    graphics.setFillColor(
      `rgba(${this.colorsParts.r}, ${this.colorsParts.g}, ${
        this.colorsParts.b
      }, ${this.lifetime / 5})`
    );
    graphics.drawCircle(this.position.x, this.position.y, 3);
  }
}
