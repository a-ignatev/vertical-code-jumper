import { Rect } from "./Rect";

export interface Context {
  entities: Entity[];
  delta: number;
  ctx: CanvasRenderingContext2D;
}

export interface Entity {
  getBoundingRect(ctx: CanvasRenderingContext2D): Rect;
  update(context: Context): void;
  render(ctx: CanvasRenderingContext2D, debug: boolean): void;
  shouldBeRemoved(): boolean;
}
