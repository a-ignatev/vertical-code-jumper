import { Graphics } from "engine/core/Graphics";

export interface Particle {
  update(delta: number): void;
  render(graphics: Graphics): void;
  lifetime: number;
}
