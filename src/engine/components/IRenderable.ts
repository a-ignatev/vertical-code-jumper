import { Graphics } from "engine/core/Graphics";

export interface IRenderable {
  render(graphics: Graphics, debug: boolean): void;
}

export function isIRenderable(component: object): component is IRenderable {
  return "render" in component;
}
