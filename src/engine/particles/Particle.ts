import { Graphics } from "engine/core/Graphics";

export abstract class Particle {
  abstract update(delta: number): void;
  abstract setPosition(x: number, y: number): void;
  abstract render(graphics: Graphics): void;
  abstract lifetime: number;
}
