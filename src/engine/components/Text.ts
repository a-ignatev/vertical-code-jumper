import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { getColor } from "game/helpers";
import { Component } from "./Component";
import { IRenderable } from "./IRenderable";

export class Text extends Component implements IRenderable {
  private font = `${globalFontSize}px ${globalFontFamily.split(",")[0]}`;
  private color = getColor("--vscode-editor-foreground");
  private word: string = "";

  constructor(entity: Entity, word: string) {
    super(entity);

    this.setText(word);
  }

  setText(text: string) {
    this.word = text;
  }

  setColor(color: string) {
    this.color = color;
  }

  setFont(font: string) {
    this.font = font;
  }

  render(graphics: Graphics) {
    const { x, y } = this.getWorldPosition();

    graphics.setFont(this.font);
    graphics.setFillColor(this.color);
    graphics.fillText(this.word, x, y);
  }

  getWidth() {
    const graphics = this.getEntity()
      .getScene()
      .getSceneManager()
      .getGraphics();

    graphics.setFont(this.font);

    return graphics.measureText(this.word).width;
  }

  getHeight() {
    const graphics = this.getEntity()
      .getScene()
      .getSceneManager()
      .getGraphics();

    graphics.setFont(this.font);
    const measure = graphics.measureText(this.word);

    return measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
  }

  destroy(): void {}
}
