import { StaticWord } from "../entities/Word";
import { Guy } from "../entities/Guy";
import { Scene } from "../../engine/scenes/Scene";

export class Intro extends Scene {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    super();

    this.ctx = ctx;
    this.onClick = this.onClick.bind(this);
  }

  attach(): void {
    const titleText = "Vertical Code Jumper";
    const helpText = "Click to play";
    const keysText = "Press ← and → to move";

    const guy = new Guy(window.innerWidth / 2, window.innerHeight / 2, false);
    const title = new StaticWord(
      titleText,
      window.innerWidth / 2 - this.ctx.measureText(titleText).width / 2,
      window.innerHeight / 2 + 2 * globalFontSize
    );

    const keys = new StaticWord(
      keysText,
      window.innerWidth / 2 - this.ctx.measureText(keysText).width / 2,
      window.innerHeight / 2 + 4 * globalFontSize
    );
    const help = new StaticWord(
      helpText,
      window.innerWidth / 2 - this.ctx.measureText(helpText).width / 2,
      window.innerHeight / 2 + 6 * globalFontSize
    );

    this.setEntities([guy, title, help, keys]);

    window.addEventListener("click", this.onClick);
  }

  detach(): void {
    window.removeEventListener("click", this.onClick);
  }

  private onClick() {
    this.sceneManager?.switchScene("game");
  }
}
