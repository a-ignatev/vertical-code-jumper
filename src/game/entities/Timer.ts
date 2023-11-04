import { Context, Entity } from "engine/entities/Entity";
import { Scene } from "engine/scenes/Scene";

export class Timer extends Entity {
  private elapsedTimeS = -1;
  private interval: number;
  private fileOnStart: boolean;
  private callback: () => void;

  constructor(
    scene: Scene,
    interval: number,
    fileOnStart: boolean = false,
    callback: () => void
  ) {
    super(scene);

    this.interval = interval;
    this.fileOnStart = fileOnStart;
    this.callback = callback;
  }

  update({ delta }: Context): void {
    this.elapsedTimeS += delta;

    if (
      (this.fileOnStart && this.elapsedTimeS < 0) ||
      this.elapsedTimeS >= this.interval
    ) {
      this.elapsedTimeS = 0;
      this.callback();
    }
  }
}
