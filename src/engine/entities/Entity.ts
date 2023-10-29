import { Scene } from "engine/scenes/Scene";
import { Rect } from "./Rect";

export interface Context {
  entities: Entity[];
  delta: number;
  ctx: CanvasRenderingContext2D;
}

export abstract class Entity {
  protected scene?: Scene;

  abstract getBoundingRect(ctx: CanvasRenderingContext2D): Rect;
  abstract update(context: Context): void;
  abstract render(ctx: CanvasRenderingContext2D, debug: boolean): void;
  abstract tryDestroyEntity(): boolean;

  getZOrder() {
    return 0;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }
}
