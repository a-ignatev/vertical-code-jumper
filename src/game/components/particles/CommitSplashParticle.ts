import { Graphics } from "engine/core/Graphics";
import { hexToRgb } from "game/helpers";
import { Particle } from "./Particle";

export class CommitSplashParticle implements Particle {
  lifetime: number;
  private position: { x: number; y: number };
  private velocity: number;
  private colorsParts: { r: number; g: number; b: number };

  constructor(center: { x: number; y: number }, color: string) {
    this.lifetime = Math.random() * 3 + 1;
    this.position = center;

    this.colorsParts = hexToRgb(color) || { r: 0, g: 0, b: 0 };
    this.velocity = -Math.random() * 180 - 20;
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
