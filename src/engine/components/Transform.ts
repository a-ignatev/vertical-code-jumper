import { Entity } from "engine/entities/Entity";
import { Component } from "./Component";

export class Transform extends Component {
  private x: number;
  private y: number;

  constructor(entity: Entity, x: number, y: number) {
    super(entity);

    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  destroy(): void {}
}
