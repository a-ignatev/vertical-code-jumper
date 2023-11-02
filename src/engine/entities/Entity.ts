import { Scene } from "engine/scenes/Scene";
import { Rect } from "./Rect";

export interface Context {
  delta: number;
  ctx: CanvasRenderingContext2D
}

export abstract class Entity {
  // must be set by the scene
  private scene!: Scene;
  // must be set by the scene
  public name!: string;

  abstract getBoundingRect(): Rect;
  abstract update(context: Context): void;
  abstract render(ctx: CanvasRenderingContext2D, debug: boolean): void;

  getZOrder() {
    return 0;
  }

  getScene() {
    return this.scene;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }
}
